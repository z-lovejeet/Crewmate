import time
import asyncio
import logging
from typing import Dict, Any, Callable, Optional
from functools import wraps
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

logger = logging.getLogger(__name__)

# Sliding window rate limiter tracker: IP -> List[timestamps]
_RATE_LIMIT_STORE: Dict[str, list] = {}
RATE_LIMIT_MAX_REQUESTS = 120
RATE_LIMIT_WINDOW_SECONDS = 60

# Circuit Breakers state per agent/service
class CircuitBreaker:
    def __init__(self, name: str, failure_threshold: int = 3, recovery_timeout: float = 30.0):
        self.name = name
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = 0.0
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN

    def record_success(self):
        self.failure_count = 0
        self.state = "CLOSED"

    def record_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
            logger.error(f"🚨 Circuit Breaker '{self.name}' tripped to OPEN state after {self.failure_count} failures!")

    def can_execute(self) -> bool:
        if self.state == "CLOSED":
            return True
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = "HALF_OPEN"
                logger.info(f"🔄 Circuit Breaker '{self.name}' transitioning to HALF_OPEN probe state.")
                return True
            return False
        if self.state == "HALF_OPEN":
            return True
        return True


_CIRCUIT_BREAKERS: Dict[str, CircuitBreaker] = {}

def get_circuit_breaker(service_name: str) -> CircuitBreaker:
    if service_name not in _CIRCUIT_BREAKERS:
        _CIRCUIT_BREAKERS[service_name] = CircuitBreaker(service_name)
    return _CIRCUIT_BREAKERS[service_name]


def with_circuit_breaker(service_name: str, fallback_func: Optional[Callable] = None):
    """Decorator to protect async service/agent calls with automated Circuit Breaker fallback."""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cb = get_circuit_breaker(service_name)
            if not cb.can_execute():
                logger.warning(f"⚠️ Circuit Breaker '{service_name}' is OPEN. Returning fallback response.")
                if fallback_func:
                    if asyncio.iscoroutinefunction(fallback_func):
                        return await fallback_func(*args, **kwargs)
                    return fallback_func(*args, **kwargs)
                return {
                    "status": "degraded_fallback",
                    "circuit_breaker": "OPEN",
                    "service": service_name,
                    "message": "Service temporarily in fallback mode to prevent cascade failure."
                }

            try:
                res = await func(*args, **kwargs)
                cb.record_success()
                return res
            except Exception as e:
                cb.record_failure()
                logger.error(f"Execution failed on '{service_name}': {e}")
                if fallback_func:
                    if asyncio.iscoroutinefunction(fallback_func):
                        return await fallback_func(*args, **kwargs)
                    return fallback_func(*args, **kwargs)
                raise e
        return wrapper
    return decorator


class AgentGatewayMiddleware(BaseHTTPMiddleware):
    """API Gateway Middleware enforcing sliding window rate limits and standardized telemetry headers."""
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()

        # Sliding window rate check
        if client_ip not in _RATE_LIMIT_STORE:
            _RATE_LIMIT_STORE[client_ip] = []

        # Prune timestamps older than window
        _RATE_LIMIT_STORE[client_ip] = [t for t in _RATE_LIMIT_STORE[client_ip] if now - t < RATE_LIMIT_WINDOW_SECONDS]

        if len(_RATE_LIMIT_STORE[client_ip]) >= RATE_LIMIT_MAX_REQUESTS:
            logger.warning(f"Rate limit exceeded for IP {client_ip} ({len(_RATE_LIMIT_STORE[client_ip])} reqs in {RATE_LIMIT_WINDOW_SECONDS}s)")
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Rate limit exceeded",
                    "code": "GATEWAY_RATE_LIMIT",
                    "limit": RATE_LIMIT_MAX_REQUESTS,
                    "window_seconds": RATE_LIMIT_WINDOW_SECONDS,
                    "message": "Too many requests. Enterprise gateway rate limit triggered."
                }
            )

        _RATE_LIMIT_STORE[client_ip].append(now)

        start_time = time.time()
        response = await call_next(request)
        duration_ms = (time.time() - start_time) * 1000

        # Inject Gateway Governance Headers
        response.headers["X-Gateway-Engine"] = "Crewmate-GEAP-v2"
        response.headers["X-Response-Time-Ms"] = f"{duration_ms:.2f}"
        return response
