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

# Copy backend source and pre-built frontend assets
COPY backend/ ./backend/
COPY frontend/dist/ ./frontend/dist/
COPY backend/static/ ./backend/static/

# Cloud Run environment settings
ENV PORT=8080
ENV ENVIRONMENT=production
ENV GCP_PROJECT_ID=crewmate-507013
ENV GCP_REGION=us-central1
ENV USE_VERTEX_AI=true
ENV PYTHONUNBUFFERED=1

EXPOSE 8080

CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
