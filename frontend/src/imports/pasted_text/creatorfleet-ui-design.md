You are a world-class UI/UX designer and senior frontend engineer. Design and build the complete frontend for "CreatorFleet" — a beautiful, award-winning enterprise AI agent dashboard for content creators. This must win "Best Multimodal UX" at a major hackathon.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN DIRECTION: 3D CLAYMORPHISM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LIGHT THEME ONLY. Warm, soft, human-designed. Think soft clay / marshmallow / rubber — every element looks like it's gently molded from soft material. Puffy 3D depth created by layered shadows (inner highlights + outer shadows). Generous border-radius (16-32px on everything). Warm cream background, white surfaces, pastel accent tints. Clean, minimal, premium — lots of whitespace. Nothing cluttered.

This should look like a Dribbble Top Shot. Beautiful. Pretty. Delightful. Award-winning.

The signature CSS pattern for every clay element:
box-shadow:
  12px 12px 24px rgba(0,0,0,0.08),      /* outer bottom-right shadow */
  -6px -6px 18px rgba(255,255,255,0.9),  /* outer top-left light */
  inset 0 3px 6px rgba(255,255,255,0.7), /* inner top highlight */
  inset 0 -2px 4px rgba(0,0,0,0.05);    /* inner bottom subtle shadow */
border-radius: 20px;

Button press squish: scale(0.96) + switch to inset shadows.
Card hover: translateY(-4px) + deeper outer shadow.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Next.js 14 (App Router with app/ directory)
- React 18 + TypeScript
- Tailwind CSS 3 (custom theme)
- Framer Motion for ALL animations (spring physics, gestures, layout transitions, page transitions)
- Web Speech API for voice input
- WebSocket for real-time agent updates

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COLOR PALETTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WARM LIGHT BACKGROUNDS:
  App background: #FAFAF5 (warm cream)
  Secondary bg: #F5F3EE (soft linen)
  Surface (cards): #FFFFFF (pure white)

BRAND COLORS:
  Primary: #6366F1 (soft indigo — intelligence, trust)
  Primary light: #A5B4FC
  Primary pale: #EEF2FF (tinted backgrounds)
  Secondary: #F97066 (warm coral — risk, urgency)
  Accent: #10B981 (fresh mint — success, approved)
  Warning: #F59E0B (warm amber)
  Error: #EF4444 (soft red)
  Info: #3B82F6 (sky blue)

PLATFORM ACCENTS:
  YouTube: #FF0000
  Instagram: #E1306C

TEXT:
  Primary text: #1E293B (warm slate)
  Secondary text: #64748B
  Tertiary text: #94A3B8
  Text on colored buttons: #FFFFFF

TYPOGRAPHY:
  Headings: "Plus Jakarta Sans", weight 600-800, sizes 20-48px
  Body: "Inter", weight 400-500, sizes 14-16px
  Monospace (traces/data): "JetBrains Mono", weight 400, 13px
  Badges: "Plus Jakarta Sans", weight 700, 12-14px

BORDER RADIUS: 12px (small), 16px (medium), 20px (large cards), 24px (hero), 9999px (pills/badges)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
19 CLAYMORPHISM COMPONENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build each as a reusable React component in components/clay/:

1. ClayProgressRing — Circular SVG progress ring on white clay circular base. Track is pale grey, progress arc is gradient (primary→primary-light). Large number in center (Plus Jakarta Sans 800). Label below. Spring animation on value change. Variants: primary (indigo), warning (amber), danger (red). Sizes: sm=80px, md=120px, lg=180px. Props: value, label, size, variant.

2. ClayCard — White card with signature clay shadow. Border-radius 20px. Subtle 1px border (rgba(0,0,0,0.04)). Inner top highlight gradient. Generous 24px padding. Optional colored 4px accent stripe on left or top. Hover: lifts 4px with deeper shadow (spring animation). Props: children, accent color, onClick, isSelected.

3. ComplianceOrb — Large soft circle showing compliance scan status. Multiple subtle concentric rings. Pulsing radar ping animation (expanding circle that fades out). Colored dots for YouTube (red) and Instagram (pink). Overall compliance % in center. Props: platforms array, isScanning.

4. ActivityFeed — Vertical scrolling list of pill-shaped message items. Each: white clay surface, rounded, color-coded left dot, agent icon, timestamp, message text. Newest at top. New items slide in with spring animation. Pauses on hover. Props: messages array.

5. MusicPlayer — Soft rounded card. Circular album art placeholder (120px). Waveform bars (5-7 thin bars that bounce when playing). Play/pause circular button in primary color. Progress bar with primary gradient. Track name + artist label. Props: trackName, isPlaying, onPlayPause, variant (original/alternative).

6. AccordionDrawer — Stacked expandable sections. Each header: white clay row with rounded corners, icon, label, chevron. Expand: content slides down with spring, chevron rotates 90°. Active section has colored left accent. Props: sections array, allowMultiple.

7. VoiceWave — Row of 5-7 thin rounded bars that bounce with audio level. Primary color gradient. Inside clay container. Microphone circular button beside it. "Listening..." text when active. Props: level, isActive, onMicClick.

8. StatusBadge — Soft rounded pill with clay shadow. Colored pale background + colored text + optional icon. Bouncy pop animation on appear (scale 0→1.15→1). Types: approved (mint), flagged (amber), critical (coral), pending (grey), info (indigo). Props: type, text, size.

9. ClayToggle — Rounded track (48×28px) with recessed clay shadow. Circular thumb with raised clay shadow. OFF: grey track. ON: primary track, thumb slides right with spring bounce. Props: checked, onChange, label, disabled.

10. ClayButton — Rounded rectangle (16px radius). Clay shadow for 3D raised look. Inner top highlight. On press: scale(0.96), shadow switches to inset (squishes). Variants: Primary (indigo gradient, white text), Secondary (white, primary text), Danger (red gradient, white text), Ghost (transparent, text only). Props: label, onClick, icon, variant, size (sm/md/lg), isLoading, disabled.

11. ContentCard — White card with clay shadow, 20px radius. Optional colored header band. Clean typography. Optional footer with actions. Hover lifts. For documents, reports, previews. Props: title, subtitle, children, footer, headerColor.

12. StatusDot — Small circle (10-14px) with soft colored glow. Pulsing option. Green=active, Amber=busy, Red=error, Grey=idle. Props: status, pulse, size.

13. SidePanel — Cream bg (bg-secondary). Clay shadow cast rightward. Logo at top, nav items as rounded rows (hover→bg-tertiary, active→primary-pale), voice section at bottom. Full height.

14. GlassOverlay — Semi-transparent white (rgba(255,255,255,0.7)), backdrop-blur(20px). Rounded 24px. Subtle border. For modals, overlays, drag-drop zones. Props: children, onClose.

15. NotesBoard — Clay container with warm bg. Masonry grid of small pastel note cards with colored pin dots. Each card slightly rotated for organic feel. Props: notes array.

16. ChecklistCard — White clay card. Title header. Custom checkboxes (rounded squares, fill with primary + ✓ bounce on check). Progress bar at bottom showing completion %. Props: title, items, onToggle.

17. RangeDial — Horizontal slider. Recessed clay track. White circular thumb with clay shadow. Active track fills with primary gradient. Value tooltip on drag. Props: value, min, max, onChange, label.

18. StatDisplay — Large number (Plus Jakarta Sans 800). Clay container. Optional trend arrow (↑ green, ↓ red). Label below. Optional pale tint background. Props: value, label, trend, tintColor.

19. AgentStatusCard — Small clay card (140×100px). Agent emoji icon at top. Name in subhead. StatusDot. Task count pill badge. Compact grid-friendly. Props: agentName, icon, status, taskCount, onToggle.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APP SHELL (Persistent Layout)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LEFT SIDEBAR (240px, cream bg, clay shadow cast right):
  - "CreatorFleet" logo: Plus Jakarta Sans 800, primary color (#6366F1), 20px
  - Nav items as rounded rows with icons:
    🏠 Command Center
    📋 Contracts
    🛡️ Compliance
    📡 Distribution
    🤖 Fleet Monitor
    📊 Reports
  - Active: primary-pale bg + primary text + StatusDot green
  - Hover: bg-tertiary
  - Divider (subtle 1px line)
  - VoiceWave component at bottom with mic button
  - Version "v1.0" in tertiary text

HEADER (within main area, sticky):
  Page title (Plus Jakarta Sans 700, 28px, text-primary) + subtitle (text-secondary)
  Right side: Notification bell (clay circle, badge count), Voice button, Settings gear

MAIN CONTENT: Warm cream background (#FAFAF5). 32px padding. Smooth scroll.

PAGE TRANSITIONS: Framer Motion AnimatePresence — content fades + slides (opacity 0→1, y: 20→0, duration 400ms, easeOut).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6 PAGES TO BUILD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE 1: COMMAND CENTER (app/page.tsx)
Greeting: "Good afternoon, Creator 👋" + subtitle "Here's your fleet status"
Top row: 3 hero stats in ClayCards — Compliance Score (ClayProgressRing lg), Contracts Pending (StatDisplay with trend arrow), Revenue (StatDisplay "$12K" with ↑+15%)
Middle: Agent Fleet Status — labeled section with 9 AgentStatusCards in responsive grid (5+4 layout). Each shows agent emoji, name, StatusDot, task count, ClayToggle.
Left bottom: ComplianceOrb (medium) scanning YouTube + Instagram
Right bottom: NotesBoard with 3-4 pinned alert notes
Full-width bottom: ActivityFeed showing recent agent actions (scrollable, max 6 visible)

PAGE 2: CONTRACT ANALYZER (app/contracts/page.tsx)
Split layout (55/45).
Left: Large ClayCard containing ContentCard with contract text. Tabs below (Terms, Rights, Payment, Exit). Drag-and-drop zone: GlassOverlay with dashed border rectangle, bouncing ↓ arrow, "Drop contract PDF here".
Right: AI Analysis panel in ClayCard. Top: ClayProgressRing (risk score, lg, variant danger). Scrollable clause list — each clause in ContentCard with clause number, title, StatusBadge (approved/flagged/critical), explanation, suggested counter-term. Revenue Insight section: deal value vs market with StatusBadge "19% Below Market". Action buttons: ClayButton "Generate Report" (primary), ClayButton "Counter-Proposal" (secondary), ClayButton "Approve" (accent/success).

PAGE 3: COMPLIANCE RADAR (app/compliance/page.tsx)
Left: ComplianceOrb (large) with scanning animation. Content category below: StatusBadge "Tech Review — classified by Gemma".
Right: Platform compliance panels — YouTube ChecklistCard (FTC ☑, Copyright ⚠, Guidelines ☑, Branded Content ☑) with ClayProgressRing 87%. Instagram ChecklistCard (Branded Tag ☑, Caption ⚠, Image Rights ☑, Hashtags ☑) with ClayProgressRing 72%.
Bottom: Music Copyright section — 3 MusicPlayer cards in a row (Original ⚠, Alternative 1 ✅ Lyria, Alternative 2 ✅ Lyria).
Top right: ClayToggle "Auto-Scan" enabled.

PAGE 4: FLEET MONITOR (app/fleet/page.tsx)
Top: 9 AgentStatusCards in grid (5+4). Each has emoji, name, StatusDot, task count, mini progress, ClayToggle.
Center: "Agent Reasoning Trace" — expanded ActivityFeed showing detailed agent reasoning logs. Monospace font (JetBrains Mono), timestamps, agent names, actions. Auto-scrolling, pauses on hover.
Bottom: "Memory Bank" — AccordionDrawer with sections: BrandX History, BrandY History, My Preferences, Content Patterns. Each expands to show stored memory data.

PAGE 5: DISTRIBUTION HUB (app/distribution/page.tsx)
Left: Platform readiness — YouTube ClayProgressRing 92% + ChecklistCard. Instagram ClayProgressRing 78% + ChecklistCard. ClayToggle "Auto-Publish" + ClayToggle "Cross-Post".
Right: Content Calendar — ClayCard with week grid (Mon-Sun columns, colored dots for YouTube 🔴 and Instagram 🟣, times). Optimal Timing section (Audience Agent suggestions). Metadata preview in ContentCard (title, tags, description). Action buttons: ClayButton "Generate Metadata" + ClayButton "Schedule".

PAGE 6: REPORTS CENTER (app/reports/page.tsx)
Left (35%): AccordionDrawer as report archive — Monthly drawers with report entries. "Video Summaries (Veo)" section with playable entries.
Right (65%): Large ContentCard showing report preview — header with "CreatorFleet Compliance Report" title, creator name, period, inline ClayProgressRing for score, risk summary table, StatusBadge for overall status. Action buttons: ClayButton "Export PDF", ClayButton "Send to Brand", ClayButton "Generate Video (Veo)".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MULTIMODAL UX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VOICE: Persistent mic in sidebar. VoiceWave + ClayButton (mic icon, primary). Click → bars bounce → Web Speech API → transcription in ActivityFeed → agent response follows.

FILE UPLOAD: Drag file on Contracts page → GlassOverlay with dashed rectangle, bouncing ↓ icon, "Drop PDF here". On drop → progress ring fills → navigate to analysis.

REAL-TIME (WebSocket): ActivityFeed gets new messages (slide in). AgentStatusCards update StatusDots. ClayProgressRings animate. Notifications toast from right. ComplianceOrb pings on scan complete.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API ENDPOINTS (Mock initially)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Base: http://localhost:8000/api/v1

GET /fleet/health, GET /fleet/agents, GET /fleet/agents/{id}/traces, POST /fleet/agents/{id}/toggle
POST /contracts/upload, GET /contracts, GET /contracts/{id}, POST /contracts/{id}/analyze
POST /compliance/scan, GET /compliance/youtube, GET /compliance/instagram
POST /distribution/check, GET /distribution/calendar, POST /distribution/metadata
POST /reports/generate, GET /reports, GET /reports/{id}
GET /memory/brands, GET /memory/preferences
GET /revenue/summary
POST /voice/command
WS ws://localhost:8000/ws/fleet

Create lib/api.ts with typed functions. Use mock data with setTimeout(500-2000ms) delays.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANIMATIONS & MICRO-INTERACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EVERY interactive element must have motion:
- Buttons: hover → scale(1.02)+lift 1px. Press → scale(0.96)+squish shadow. Spring: stiffness 400, damping 15.
- Cards: hover → translateY(-4px)+shadow deepens. Spring: stiffness 300, damping 20.
- Page transitions: AnimatePresence with fade+slide (opacity 0→1, y: 20→0, 400ms).
- List items: staggerChildren 0.05s, each slides in from y:10.
- StatusBadge: pop in with scale 0→1.15→1 (400ms spring).
- Toggles: thumb slides with spring bounce (stiffness 400).
- Progress rings: pathLength animates with spring (1.2s easeOut).
- Loading: 3 dots bouncing in sequence (primary, secondary, accent colors).
- Skeletons: rounded clay shapes pulsing opacity 0.4↔0.7.
- Notifications: slide from right, auto-dismiss 5s.
- Checkboxes: fill with primary + ✓ appears with scale bounce.
- Drag hover: dashed zone pulses gently.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCESSIBILITY & RESPONSIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- All interactive: keyboard accessible (Tab, Enter/Space)
- aria-live="polite" on ActivityFeed
- aria-label on ClayProgressRing, StatusDot, AgentStatusCard
- WCAG AA contrast on all text
- Focus rings: 2px primary outline with 2px offset
- Breakpoints: 1280px+ (full layout), 1024px (sidebar collapses to icons), 768px (stack splits vertically), 640px (single column, simplify orb to list)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL DESIGN NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- CSS custom properties for ALL tokens
- Create global clay.css with .clay-sm, .clay-md, .clay-lg, .clay-xl, .clay-pressed utility classes
- All components in components/clay/ as separate files
- Export from components/clay/index.ts
- Skeleton loading states matching content shapes
- Empty states: friendly illustration + text + CTA button
- Error states: coral tinted card + error icon + retry button
- Favicon: small indigo circle with "CF" text
- Page titles: "CreatorFleet — [Page Name]"
- Light theme ONLY (no dark mode toggle needed)
- Generous whitespace everywhere — premium = breathing room

Make it beautiful. Make it soft. Make it feel like touching clouds. Make it win.