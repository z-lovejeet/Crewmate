# Demo & Polish — Crewmate

## 1. 4-Minute Demo Video Script

**[0:00 - 0:30] The Hook & Problem**
*Visual*: Start with webcam full screen. The "Unlikely Hero" (Creator) looks stressed, surrounded by real papers and a complex spreadsheet.
*Narration*: "Being a solo creator used to mean making content. Now, it means being a lawyer, a compliance officer, a distributor, and an analyst. It's exhausting. But what if you had an enterprise-grade fleet of AI agents working for you 24/7? Meet Crewmate."

**[0:30 - 1:15] The Solution & Dashboard**
*Visual*: Screen recording of the **Creator Command Center**. Show the beautiful claymorphism dashboard with soft clay cards, pulsing progress rings, and warm cream background. Activity feed is scrolling.
*Narration*: "Welcome to Crewmate. Powered by Google Cloud and Gemini 3.7 Flash, I have 14 specialized agents monitoring my empire. You can see their live status here on the agent grid. Right now, the Fleet Orchestrator is coordinating everything."

**[1:15 - 2:00] Contract Analysis (Agent 1 & 2)**
*Visual*: Switch to **Contract Analyzer**. Drag and drop a PDF into the drop zone. The Progress Ring spins up with risk score.
*Narration*: "A brand just sent me a sponsorship contract. Instead of paying a lawyer, I drop it to my Contract Reviewer agent. It reads the PDF, while the Brand Safety agent checks the brand's history. Look at this—it flagged a perpetual rights clause in red. Let's reject that." (Click ClayButton Reject).

**[2:00 - 2:45] Compliance & Multimodal (Agent 3)**
*Visual*: Switch to **Compliance Radar**. ComplianceOrb pulses with scanning animation. A red status dot appears. The MusicPlayer card pops up.
*Narration*: "My Content Compliance agent is scanning my latest video using Google's Veo and Gemma models. Wait, it caught copyrighted background music. Instead of a strike, the agent uses Lyria to instantly generate a royalty-free alternative track that matches the vibe." (Click Play on MusicPlayer).

**[2:45 - 3:30] Distribution & Voice Command**
*Visual*: Switch to **Distribution Hub**. Click the Microphone button (VU Meter bounces).
*Narration*: "Time to publish. I'll just tell my Orchestrator: *'Prepare the summer vlog for YouTube and Instagram.'*" (Speak this). *Visual*: See the UI react, toggles flip automatically. "The Distribution Manager formats the video, the Revenue Optimizer sets the tags, and we are scheduled."

**[3:30 - 4:00] Conclusion & Architecture**
*Visual*: Show the Architecture Diagram briefly, then back to the Dashboard.
*Narration*: "Built on FastAPI, Next.js, and Google Cloud, Crewmate brings enterprise agentic workflows to the solo creator. The Fortified Enterprise Fleet isn't just for big corps anymore. It's for us."

---

## 2. Demo Recording Setup

- **Software**: OBS Studio
- **Resolution**: 1920x1080 (16:9) at 60 FPS for buttery smooth UI animations.
- **Audio**: Dedicated USB microphone, noise gate filter applied in OBS.
- **Layouts**:
  - Scene 1: Webcam full screen.
  - Scene 2: Browser window full screen + small circular Picture-in-Picture (PiP) of webcam in bottom right.
- **Lighting**: Bright, clean lighting to match the warm cream claymorphism UI aesthetic.

---

## 3. Pre-Seeded Demo Data

To ensure a flawless demo, pre-load the database with:
- **Contract PDF**: `AcmeCorp_Sponsorship_V2.pdf` (contains an obvious bad clause: "Creator grants AcmeCorp rights to all content in perpetuity").
- **Agent Traces**: Pre-populate the Firestore `logs` collection with 50 realistic thought processes so the Ticker Tape is moving immediately upon load.
- **Compliance Video**: A short 10-second clip of a vlog with a recognizable pop song in the background to trigger the copyright alert.

---

## 4. Demo Flow Choreography

1. Start on Home screen. Wait 3 seconds.
2. Move mouse smoothly to the left navigation. Click "Contracts".
3. Drag `AcmeCorp_Sponsorship_V2.pdf` from desktop into the browser. Wait for gauge animation.
4. Scroll down the paper document exactly 400px to show the red stamp. Click "Reject".
5. Click "Radar" in navigation. Wait for red blip.
6. Click the Vinyl Player "Play" button. Let audio play for 4 seconds. Stop.
7. Click "Distribution".
8. Click Microphone. Speak command clearly. Watch toggles flip.
9. End recording.

---

## 5. Fallback Strategy

Live AI demos fail. Be prepared.
- **Cached API Route**: In the Next.js API routes, add a header `x-demo-mode: true`. If true, bypass the actual Gemini API call and return a hardcoded JSON response after a `setTimeout` of 2000ms.
- **Local Fallback**: If Cloud Run goes down, have the local FastAPI server running on port 8000. Switch the `.env.local` `NEXT_PUBLIC_API_URL` to `http://localhost:8000` just in case.

---

## 6. Devpost Write-Up Template

- **Inspiration**: The "Unlikely Hero" - solo creators are overwhelmed. They need a team but can't afford one.
- **What it does**: A 14-agent fleet that automates contract review, copyright compliance, distribution, and revenue optimization via a beautiful 3D claymorphism interface with soft clay components, warm light theme, and premium micro-animations.
- **How we built it**: Python/FastAPI backend, Next.js frontend. Gemini 3.7 Flash for reasoning, Veo/Lyria for multimodal, deployed on Google Cloud.
- **Challenges**: Managing state across 14 concurrent agents; achieving 60fps animations on heavy CSS shadows.
- **Accomplishments**: Fully functioning pub/sub agent communication; beautiful non-standard UI.
- **What we learned**: Agentic design patterns (Orchestrator/Worker) and how to ground AI in physical metaphors.
- **What's next**: Mobile app, TikTok API integration, autonomous email negotiation.

---

## 7. Blog Post Outline (Medium)
**Title**: How I Built an Enterprise Agent Fleet for Content Creators
- **Introduction**: The solo creator burnout epidemic.
- **The Architecture**: Explaining the Orchestrator-Worker pattern with Gemini.
- **Designing for AI**: Why I chose 3D claymorphism over flat design to make AI feel warm, approachable, and human-designed.
- **Technical Deep Dive**: Using Antigravity SDK and Pub/Sub for inter-agent messaging.
- **Conclusion**: The future of the one-person billion-dollar company.

---

## 8. Social Media Post Template

🚀 Just submitted "Crewmate" for the #AllThingsAgenticHackathon! 

Solo creators are overwhelmed playing lawyer, editor, and manager. Crewmate gives them a 14-agent enterprise fleet to automate their empire, powered by Google Cloud and Gemini 3.7 Flash. 

✨ Features:
- Autonomous Contract Analysis
- Real-time Copyright Compliance via Veo & Lyria
- Stunning 3D Claymorphism UI

Check out the demo here: [Link]
#GoogleCloud #Gemini #AI #Hackathon #CreatorEconomy

---

## 9. Architecture Diagram Creation Guide

- **Tool**: Excalidraw
- **Style**: Dark mode background, clean colorful lines.
- **Components to include**:
  - User (Web UI)
  - API Gateway (FastAPI)
  - Orchestrator Agent (Center node)
  - 13 Worker Agents (surrounding Orchestrator)
  - Google Cloud services (Cloud Run, Pub/Sub, Firestore, Model Armor)
  - External APIs (YouTube, Instagram)
- **Color Coding**: Blue for Google infrastructure, Green for Agents, Orange for databases.
- Export as high-res PNG for the README and Devpost.

---

## 10. README Template

```markdown
# Crewmate 🚀

An enterprise-grade multi-agent fleet for solo content creators.

## Overview
[1 paragraph description]

## Architecture
![Architecture Diagram](./docs/arch.png)

## Tech Stack
- Frontend: Next.js, Tailwind, Framer Motion
- Backend: Python, FastAPI
- AI: Gemini 3.7 Flash, Veo, Lyria
- Cloud: Google Cloud (Run, Firestore, Pub/Sub, Model Armor)

## Setup Instructions
1. `git clone`
2. `cd frontend && npm install`
3. `cd backend && pip install -r requirements.txt`
4. Set `.env` variables (Google Cloud credentials).
5. Run `docker-compose up`.

## Testing
Run `pytest` in the backend directory for unit tests on agent reasoning logic.
```

---

## 11. Polish Checklist (Final 48 Hours)

- [ ] **Favicon**: Create a small leather/metal badge icon and add to Next.js.
- [ ] **Meta Tags**: Update title, description, and OG image for social sharing.
- [ ] **Empty States**: Ensure all lists/tables look good when no data is present (e.g., "No active contracts").
- [ ] **Loading States**: Add skeleton loaders or spinning gears while agents are "thinking".
- [ ] **Error States**: Toast notifications for API failures.
- [ ] **Accessibility**: Check contrast, add `aria-labels` to custom metal buttons.
- [ ] **Performance**: Run Lighthouse, ensure no massive layout shifts from font loading.
- [ ] **Mobile View**: Ensure the UI doesn't completely break on phones, even if desktop is primary.
