# ─── Stage 1: Build React Frontend ─────────────────────────
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

# Install pnpm
RUN npm install -g pnpm

# Copy package files and install dependencies
COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source code and build production bundle
COPY frontend/ ./
RUN pnpm build

# ─── Stage 2: Production Python Backend + Static SPA ───────
FROM python:3.13-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/pyproject.toml ./backend/
RUN pip install --no-cache-dir \
    google-adk \
    google-genai \
    google-cloud-firestore \
    fastapi \
    "uvicorn[standard]" \
    pydantic \
    pydantic-settings \
    python-multipart \
    websockets \
    pypdf \
    httpx \
    python-dotenv

# Copy backend source code
COPY backend/ ./backend/

# Copy built frontend assets from stage 1 into both dist and static locations
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./backend/static

# Cloud Run environment settings
ENV PORT=8080
ENV ENVIRONMENT=production
ENV GCP_PROJECT_ID=crewmate-507013
ENV GCP_REGION=us-central1
ENV USE_VERTEX_AI=true
ENV PYTHONUNBUFFERED=1

EXPOSE 8080

CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
