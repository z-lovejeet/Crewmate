# Environment & Deployment — Crewmate

## 1. Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- Docker & Docker Compose
- Google Cloud CLI (`gcloud`)

### Setup Steps
```bash
# 1. Clone repository
git clone https://github.com/yourusername/crewmate.git
cd crewmate

# 2. Setup Backend Environment
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Setup Frontend Environment
cd ../frontend
npm install

# 4. Run Locally using Docker Compose
cd ..
docker-compose up --build
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  api:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - ./backend:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file:
      - .env
    volumes:
      - ./frontend:/app
    command: npm run dev
```

## 2. Environment Variables (`.env.example`)

```env
# GCP Configuration
GCP_PROJECT_ID=crewmate-507013
GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json

# LLM APIs
GEMINI_API_KEY=AIzaSy...

# Firebase / Firestore
FIRESTORE_DATABASE_ID=(default)

# Pub/Sub
PUBSUB_TOPIC_AGENT_TASKS=agent-tasks
PUBSUB_SUB_AGENT_TASKS=agent-tasks-sub

# Model Armor
MODEL_ARMOR_TEMPLATE=projects/crewmate-hackathon/locations/us-central1/templates/default

# App Config
CORS_ORIGINS=http://localhost:3000,https://crewmate.app
DEBUG=True
```

## 3. Google Cloud Project Setup

Run these commands to provision the environment:

```bash
# Set variables
PROJECT_ID="crewmate-507013"
REGION="us-central1"

# Create project & set config
gcloud projects create
# Set project
gcloud config set project crewmate-507013

# Enable required APIs
gcloud services enable \
    run.googleapis.com \
    firestore.googleapis.com \
    cloudtrace.googleapis.com \
    aiplatform.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    secretmanager.googleapis.com \
    firebasehosting.googleapis.com

# Initialize Firestore
gcloud firestore databases create --location=$REGION --type=firestore-native

# Create Pub/Sub Topic and Subscription
gcloud pubsub topics create agent-tasks
gcloud pubsub subscriptions create agent-tasks-sub --topic=agent-tasks

# Create Service Account
gcloud iam service-accounts create crewmate-sa
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:crewmate-sa@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/owner"
```

## 4. Docker Configuration

`backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

## 5. CI/CD Pipeline (`cloudbuild.yaml`)

```yaml
steps:
  # Build container
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/crewmate-api', './backend']
  
  # Push container
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/crewmate-api']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'crewmate-api'
      - '--image'
      - 'gcr.io/$PROJECT_ID/crewmate-api'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
```

## 6. Production Deployment

```bash
gcloud run deploy crewmate-api \
    --source ./backend \
    --region us-central1 \
    --set-env-vars="GCP_PROJECT_ID=$PROJECT_ID,ENVIRONMENT=production" \
    --service-account="crewmate-sa@${PROJECT_ID}.iam.gserviceaccount.com" \
    --allow-unauthenticated
```

## 7. Monitoring & Alerting
- **Cloud Trace:** Enabled via OpenTelemetry in `services/observability.py`.
- **Logs:** Automatically collected from Cloud Run to Cloud Logging.

## 8. Cost Estimation (Monthly, $150 Credit Budget)
| Service | Expected Usage | Est. Cost |
|---|---|---|
| Cloud Run | ~50 hours CPU time | $0.00 (Free Tier) |
| Firestore | < 1GB storage, 50k reads/mo | $0.00 (Free Tier) |
| Pub/Sub | < 10GB throughput | $0.00 (Free Tier) |
| Gemini API | 1M input / 200k output tokens | ~$0.50 |
| **Total** | | **~$0.50** |
