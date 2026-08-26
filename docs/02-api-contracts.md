# API Contracts & Design — Crewmate

This document defines the complete API specification that the frontend team will use to build correct API calls and the backend will implement.

## 1. Base Configuration

- **Base URL**: `/api/v1`
- **Auth Header**: `Authorization: Bearer <Firebase_JWT>`
- **Content Types**:
  - Default: `application/json`
  - File Uploads: `multipart/form-data`
- **Error Response Format**:
  ```json
  {
    "error": true,
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
  ```

## 2. REST Endpoints

### Contracts

**POST /api/v1/contracts/upload**
- **Description**: Upload PDF
- **Request**: `multipart/form-data` with field `file`
- **Response** (200):
  ```json
  {
    "id": "contract_123",
    "status": "uploaded",
    "filename": "brand_deal.pdf"
  }
  ```

**GET /api/v1/contracts**
- **Description**: List all contracts
- **Query Params**: `page` (int), `limit` (int), `status` (string)
- **Response** (200):
  ```json
  {
    "contracts": [
      {
        "id": "contract_123",
        "title": "Brand Deal Q3",
        "status": "analyzed",
        "created_at": "2024-03-10T12:00:00Z"
      }
    ],
    "total": 1
  }
  ```

**GET /api/v1/contracts/{id}**
- **Description**: Get contract details + analysis
- **Response** (200):
  ```json
  {
    "id": "contract_123",
    "title": "Brand Deal Q3",
    "summary": "...",
    "status": "analyzed"
  }
  ```

**POST /api/v1/contracts/{id}/analyze**
- **Description**: Trigger agent analysis
- **Response** (202):
  ```json
  {
    "message": "Analysis started",
    "job_id": "job_456"
  }
  ```

**GET /api/v1/contracts/{id}/risks**
- **Description**: Get risk flags
- **Response** (200):
  ```json
  {
    "risks": [
      {
        "severity": "high",
        "description": "Perpetuity clause found"
      }
    ]
  }
  ```

**POST /api/v1/contracts/{id}/negotiate**
- **Description**: Generate negotiation draft
- **Response** (200):
  ```json
  {
    "draft": "Dear Brand, we need to adjust clause 4..."
  }
  ```

**DELETE /api/v1/contracts/{id}**
- **Description**: Delete contract
- **Response** (204): No Content

### Compliance

**POST /api/v1/compliance/scan**
- **Description**: Trigger compliance scan
- **Request**:
  ```json
  {
    "content_id": "vid_123",
    "platform": "youtube"
  }
  ```
- **Response** (202): `{"status": "scanning"}`

**GET /api/v1/compliance/status**
- **Description**: Overall compliance status
- **Response** (200): `{"overall_status": "safe", "issues": 0}`

**GET /api/v1/compliance/youtube**
- **Description**: YouTube-specific
- **Response** (200): `{"status": "safe", "guidelines_met": true}`

**GET /api/v1/compliance/instagram**
- **Description**: Instagram-specific
- **Response** (200): `{"status": "safe", "guidelines_met": true}`

**POST /api/v1/compliance/ftc-check**
- **Description**: FTC disclosure check
- **Request**: `{"text": "Loving this new product"}`
- **Response** (200): `{"has_disclosure": false, "suggestion": "Add #ad"}`

**POST /api/v1/compliance/copyright-scan**
- **Description**: Copyright scan
- **Request**: `{"video_url": "..."}`
- **Response** (200): `{"copyright_claims": []}`

**GET /api/v1/compliance/history**
- **Description**: Scan history
- **Response** (200): `{"history": []}`

### Distribution

**POST /api/v1/distribution/check**
- **Description**: Check readiness
- **Response** (200): `{"ready": true}`

**GET /api/v1/distribution/youtube**
- **Description**: YouTube readiness
- **Response** (200): `{"ready": true}`

**GET /api/v1/distribution/instagram**
- **Description**: Instagram readiness
- **Response** (200): `{"ready": true}`

**POST /api/v1/distribution/metadata**
- **Description**: Generate metadata
- **Response** (200): `{"title": "Epic Vlog", "tags": ["vlog"]}`

**GET /api/v1/distribution/calendar**
- **Description**: Content calendar
- **Response** (200): `{"entries": []}`

**POST /api/v1/distribution/schedule**
- **Description**: Schedule content
- **Request**: `{"content_id": "123", "time": "2024-04-01T10:00:00Z"}`
- **Response** (200): `{"status": "scheduled"}`

**PUT /api/v1/distribution/calendar/{id}**
- **Description**: Update calendar entry
- **Request**: `{"time": "..."}`
- **Response** (200): `{"status": "updated"}`

### Growth & Strategy Endpoints

#### `GET /api/v1/trends`
Get current trending topics for the creator's niche.
- **Response**: `{ topics: [{ topic, velocity_score, saturation, format_rec, platform }] }`

#### `POST /api/v1/trends/brief`
Generate a content brief from a trending topic.
- **Request**: `{ topic: string, platform: string, format: string }`
- **Response**: `{ brief_id, titles: string[], viral_angle, timing, competitor_saturation }`

#### `POST /api/v1/scripts/generate`
Generate hooks and full script from a content brief.
- **Request**: `{ brief_id?: string, topic: string, format: "short"|"long"|"reel", style: string, sponsor_brief?: object }`
- **Response**: `{ script_id, hooks: object[], full_script: object, thumbnail_concepts: object[], retention_score }`

#### `POST /api/v1/clips/extract`
Extract viral clip candidates from a long-form video.
- **Request**: `{ video_id: string, platforms: string[], max_clips: number }`
- **Response**: `{ clips: [{ clip_id, start_ts, end_ts, summary, platform_packages, performance_score }] }`

#### `GET /api/v1/community/{content_id}/analysis`
Get community sentiment analysis for a piece of content.
- **Response**: `{ sentiment: object, clusters: object[], toxic_flagged: object[], suggested_replies: object[], content_signals: string[] }`

#### `POST /api/v1/community/{content_id}/moderate`
Apply moderation actions on flagged comments.
- **Request**: `{ comment_ids: string[], action: "hide"|"delete"|"report" }`
- **Response**: `{ moderated_count, status }`

### Fleet

**GET /api/v1/fleet/agents**
- **Description**: List agents
- **Response** (200): `{"agents": [{"id": "orchestrator", "status": "online"}]}`

**GET /api/v1/fleet/agents/{id}/status**
- **Description**: Agent status
- **Response** (200): `{"status": "idle"}`

**GET /api/v1/fleet/agents/{id}/traces**
- **Description**: Agent traces
- **Response** (200): `{"traces": []}`

**POST /api/v1/fleet/agents/{id}/toggle**
- **Description**: Enable/disable
- **Request**: `{"enabled": false}`
- **Response** (200): `{"status": "disabled"}`

**GET /api/v1/fleet/health**
- **Description**: Fleet health summary
- **Response** (200): `{"healthy": true, "active_agents": 14}`

### Reports

**POST /api/v1/reports/generate**
- **Description**: Generate report
- **Request**: `{"type": "monthly", "month": "2024-03"}`
- **Response** (202): `{"report_id": "rep_123", "status": "generating"}`

**GET /api/v1/reports**
- **Description**: List reports
- **Response** (200): `{"reports": []}`

**GET /api/v1/reports/{id}**
- **Description**: Get report
- **Response** (200): `{"id": "rep_123", "content": "..."}`

**POST /api/v1/reports/{id}/video**
- **Description**: Generate Veo video
- **Response** (202): `{"status": "rendering"}`

**POST /api/v1/reports/{id}/send**
- **Description**: Send to brand
- **Request**: `{"email": "brand@example.com"}`
- **Response** (200): `{"status": "sent"}`

### Memory

**GET /api/v1/memory/brands**
- **Description**: Brand history
- **Response** (200): `{"brands": []}`

**GET /api/v1/memory/brands/{name}**
- **Description**: Specific brand
- **Response** (200): `{"brand": {}}`

**GET /api/v1/memory/preferences**
- **Description**: Creator preferences
- **Response** (200): `{"preferences": {}}`

**PUT /api/v1/memory/preferences**
- **Description**: Update preferences
- **Request**: `{"tone": "casual"}`
- **Response** (200): `{"status": "updated"}`

### Revenue

**GET /api/v1/revenue/summary**
- **Description**: Dashboard data
- **Response** (200): `{"total_revenue": 50000}`

**GET /api/v1/revenue/deals**
- **Description**: Active deals
- **Response** (200): `{"deals": []}`

**POST /api/v1/revenue/optimize**
- **Description**: Optimization suggestions
- **Response** (200): `{"suggestions": []}`

### Voice

**POST /api/v1/voice/command**
- **Description**: Process voice command
- **Request**: `{"audio_base64": "..."}`
- **Response** (200): `{"interpreted_command": "Schedule video", "action_taken": true}`

### Security

**POST /api/v1/security/test-injection**
- **Description**: Demo injection attempt
- **Request**: `{"prompt": "Ignore previous instructions..."}`
- **Response** (200): `{"blocked": true, "reason": "Model Armor triggered"}`

**GET /api/v1/security/audit-log**
- **Description**: Model Armor log
- **Response** (200): `{"logs": []}`

## 3. WebSocket Specification

- **Endpoint**: `ws://<domain>/ws/fleet`
- **Connection**:
  - Connect with auth token in query params: `?token=<JWT>`
- **Event Types**:
  - `agent_status_change`
  - `task_progress`
  - `notification`
  - `trend_alert` — New high-velocity trend detected
  - `script_ready` — Script generation completed
  - `clips_extracted` — Clip extraction completed
  - `sentiment_update` — Community sentiment analysis updated
- **JSON Schema**:
  ```json
  {
    "type": "agent_status_change",
    "agent_id": "contract_reviewer",
    "status": "analyzing",
    "timestamp": "2024-03-10T12:05:00Z"
  }
  ```
