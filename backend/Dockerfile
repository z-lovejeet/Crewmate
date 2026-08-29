FROM python:3.13-slim

WORKDIR /app

# Install dependencies
COPY pyproject.toml ./
RUN pip install --no-cache-dir google-adk google-genai fastapi "uvicorn[standard]" \
    pydantic pydantic-settings python-multipart pypdf httpx python-dotenv \
    google-cloud-firestore

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Cloud Run uses PORT env var
ENV PORT=8080

# Run with uvicorn
CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
