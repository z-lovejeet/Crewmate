# 🎨 UI/UX Design & Figma Master Prompt — Crewmate

> **Design Direction**: 3D Claymorphism — Soft, rounded, warm, human-designed
> **Theme**: Light — warm cream background, pastel accents, soft depth
> **Target Prize**: Best Multimodal UX ($5,000)

---

## Part 1: Design Philosophy

### The Vision
Crewmate's UI feels like a **beautifully crafted toy dashboard come to life** — soft 3D elements that look molded from colorful clay, sitting on a warm cream canvas. Every component has gentle depth, rounded edges, and a playful-yet-professional personality. It's the kind of UI that makes people say *"wow, this is beautiful"* before they even understand what it does.

### Design Principles
1. **Soft Depth** — Every element has inner highlights + outer shadows creating a puffy, pillowy 3D effect. Elements look like they could be squeezed.
2. **Warm & Human** — No cold greys, no harsh edges. Warm cream backgrounds, rounded corners (16-32px), friendly colors. Feels handcrafted, not generated.
3. **Playful Professionalism** — Approachable enough to delight, serious enough for enterprise governance. Think Notion meets Nintendo.
4. **Color Storytelling** — Each feature area has its own accent color that tells a story: purple for intelligence, coral for risk, mint for success, amber for caution.
5. **Living Motion** — Gentle micro-animations everywhere: buttons squish on press, cards float on hover, progress rings pulse softly, loading states bounce playfully.
6. **Generous Space** — Lots of whitespace. Content breathes. Nothing feels cramped. Premium = space.

### What Makes This Award-Winning
- **Zero generic UI** — no shadcn defaults, no Tailwind UI templates. Every component custom-shaped.
- **Consistent 3D language** — user sees a puffy raised surface and knows "I can interact with this"
- **Cohesive color story** — purple intelligence, coral alerts, mint success carries across every page
- **Micro-interactions on EVERYTHING** — hover lifts, press squishes, spring bounces, smooth page transitions
- **Beautiful loading states** — bouncing clay dots, pulsing rings, skeleton shimmers
- **Screenshot-worthy** — every single page looks like a Dribbble shot

---

## Part 2: Complete Design System

### Color Palette

#### Core Colors
| Token | Hex | Name | Usage |
|:---|:---|:---|:---|
| `--bg-primary` | `#FAFAF5` | Warm Cream | App background — warm, inviting canvas |
| `--bg-secondary` | `#F5F3EE` | Soft Linen | Secondary sections, sidebars |
| `--bg-tertiary` | `#EDEAE3` | Light Sand | Hover states on background |
| `--surface` | `#FFFFFF` | Pure White | Cards, panels, elevated surfaces |
| `--surface-hover` | `#FEFEFE` | Bright White | Card hover states |

#### Brand Colors
| Token | Hex | Name | Usage |
|:---|:---|:---|:---|
| `--primary` | `#6366F1` | Soft Indigo | Primary actions, agent intelligence, links |
| `--primary-light` | `#A5B4FC` | Light Indigo | Primary hover, backgrounds |
| `--primary-pale` | `#EEF2FF` | Pale Indigo | Primary tinted backgrounds |
| `--secondary` | `#F97066` | Warm Coral | Risk alerts, contract flags, urgency |
| `--secondary-light` | `#FECACA` | Light Coral | Risk backgrounds |
| `--secondary-pale` | `#FEF2F2` | Pale Coral | Risk tinted backgrounds |
| `--accent` | `#10B981` | Fresh Mint | Success, compliance clear, approved |
| `--accent-light` | `#6EE7B7` | Light Mint | Success backgrounds |
| `--accent-pale` | `#ECFDF5` | Pale Mint | Success tinted backgrounds |

#### Status Colors
| Token | Hex | Name | Usage |
|:---|:---|:---|:---|
| `--success` | `#10B981` | Mint Green | Approved, clear, healthy |
| `--warning` | `#F59E0B` | Warm Amber | Review needed, in progress |
| `--error` | `#EF4444` | Soft Red | Critical, failed, blocked |
| `--info` | `#3B82F6` | Sky Blue | Informational, tips |

#### Platform Colors
| Token | Hex | Name | Usage |
|:---|:---|:---|:---|
| `--youtube` | `#FF0000` | YouTube Red | YouTube platform indicators |
| `--instagram` | `#E1306C` | Instagram Pink | Instagram platform indicators |

#### Text Colors
| Token | Hex | Usage |
|:---|:---|:---|
| `--text-primary` | `#1E293B` | Headings, primary content (warm slate) |
| `--text-secondary` | `#64748B` | Body text, descriptions |
| `--text-tertiary` | `#94A3B8` | Captions, timestamps, metadata |
| `--text-on-primary` | `#FFFFFF` | Text on colored buttons |

#### Clay Shadow Colors
| Token | Value | Usage |
|:---|:---|:---|
| `--clay-shadow-outer` | `rgba(0,0,0,0.08)` | Outer shadow for depth |
| `--clay-shadow-inner` | `rgba(255,255,255,0.9)` | Inner top highlight for 3D |
| `--clay-shadow-deep` | `rgba(0,0,0,0.12)` | Deeper shadow for more elevation |

### Typography

| Token | Font | Weight | Size | Usage |
|:---|:---|:---|:---|:---|
| `--type-hero` | `Plus Jakarta Sans` | 800 | 36-48px | Page titles, hero numbers |
| `--type-heading` | `Plus Jakarta Sans` | 700 | 24-32px | Section headings |
| `--type-subhead` | `Plus Jakarta Sans` | 600 | 18-20px | Card titles, nav items |
| `--type-body` | `Inter` | 400-500 | 14-16px | Body text, descriptions |
| `--type-caption` | `Inter` | 500 | 12-13px | Labels, timestamps, metadata |
| `--type-mono` | `JetBrains Mono` | 400 | 13px | Agent traces, code, data |
| `--type-badge` | `Plus Jakarta Sans` | 700 | 12-14px | Status badges, pills |

### Claymorphism Shadow System

The signature of claymorphism — layered shadows that make elements look soft and 3D:

```css
/* Level 1: Subtle clay — small cards, badges, buttons */
--clay-sm:
  8px 8px 16px rgba(0,0,0,0.06),
  -4px -4px 12px rgba(255,255,255,0.8),
  inset 0 2px 4px rgba(255,255,255,0.6),
  inset 0 -1px 3px rgba(0,0,0,0.04);

/* Level 2: Standard clay — cards, panels, main components */
--clay-md:
  12px 12px 24px rgba(0,0,0,0.08),
  -6px -6px 18px rgba(255,255,255,0.9),
  inset 0 3px 6px rgba(255,255,255,0.7),
  inset 0 -2px 4px rgba(0,0,0,0.05);

/* Level 3: Elevated clay — hero elements, featured cards */
--clay-lg:
  16px 16px 32px rgba(0,0,0,0.1),
  -8px -8px 24px rgba(255,255,255,0.95),
  inset 0 4px 8px rgba(255,255,255,0.8),
  inset 0 -2px 6px rgba(0,0,0,0.06);

/* Level 4: Floating clay — modals, dropdowns, tooltips */
--clay-xl:
  20px 20px 40px rgba(0,0,0,0.12),
  -10px -10px 30px rgba(255,255,255,1),
  inset 0 5px 10px rgba(255,255,255,0.85),
  inset 0 -3px 8px rgba(0,0,0,0.07);

/* Pressed state — element squishes into surface */
--clay-pressed:
  inset 4px 4px 8px rgba(0,0,0,0.08),
  inset -2px -2px 6px rgba(255,255,255,0.6),
  2px 2px 4px rgba(0,0,0,0.03);

/* Colored clay — for accent-colored components */
--clay-primary:
  8px 8px 20px rgba(99,102,241,0.25),
  -4px -4px 12px rgba(255,255,255,0.8),
  inset 0 2px 6px rgba(255,255,255,0.4);

--clay-success:
  8px 8px 20px rgba(16,185,129,0.25),
  -4px -4px 12px rgba(255,255,255,0.8),
  inset 0 2px 6px rgba(255,255,255,0.4);

--clay-danger:
  8px 8px 20px rgba(239,68,68,0.25),
  -4px -4px 12px rgba(255,255,255,0.8),
  inset 0 2px 6px rgba(255,255,255,0.4);
```

### Border Radius System
```css
--radius-sm: 12px;    /* badges, small elements */
--radius-md: 16px;    /* buttons, inputs */
--radius-lg: 20px;    /* cards, panels */
--radius-xl: 24px;    /* featured cards, containers */
--radius-2xl: 32px;   /* hero elements, modals */
--radius-full: 9999px; /* pills, circular elements */
```

### Animation System (Framer Motion)

| Animation | Config | Trigger | Feel |
|:---|:---|:---|:---|
| **Card hover float** | `{ y: -4, shadow: clay-lg, transition: { type: "spring", stiffness: 300, damping: 20 } }` | Hover | Gentle lift |
| **Button squish** | `{ scale: 0.96, transition: { type: "spring", stiffness: 400, damping: 15 } }` | Click | Satisfying press |
| **Button hover** | `{ scale: 1.02, y: -1 }` | Hover | Subtle lift |
| **Progress ring** | `{ pathLength: [0, value], transition: { duration: 1.2, ease: "easeOut" } }` | Value change | Smooth fill |
| **Badge appear** | `{ scale: [0, 1.15, 1], opacity: [0, 1, 1], transition: { duration: 0.4 } }` | Mount | Bouncy pop |
| **Page transition** | `{ opacity: [0, 1], y: [20, 0], transition: { duration: 0.4, ease: "easeOut" } }` | Route change | Slide up fade |
| **List stagger** | `{ opacity: [0, 1], y: [10, 0] }` with `staggerChildren: 0.05` | Mount | Cascade reveal |
| **Skeleton pulse** | `{ opacity: [0.4, 0.7, 0.4], transition: { repeat: Infinity, duration: 1.5 } }` | Loading | Gentle breathe |
| **Toast slide** | `{ x: [100, 0], opacity: [0, 1], transition: { type: "spring", stiffness: 200 } }` | Notification | Slide in |
| **Gauge needle** | `{ rotate: [0, angle], transition: { type: "spring", stiffness: 50, damping: 10 } }` | Value change | Springy settle |
| **Radar ping** | `{ scale: [1, 2.5], opacity: [0.6, 0], transition: { duration: 2, repeat: Infinity } }` | Always | Expanding ring |
| **Loading dots** | `{ y: [0, -12, 0], transition: { repeat: Infinity, duration: 0.6, staggerChildren: 0.1 } }` | Loading state | Bouncing clay dots |

### Loading States

```
SKELETON LOADING: Rounded rectangles with clay-sm shadow, pulsing between
bg-secondary and bg-tertiary. Match the shape of the content they replace.

SPINNER: 3 soft colored dots (primary, secondary, accent) bouncing in sequence.
Each dot is a small circle with clay-sm shadow.

PROGRESS: Soft gradient progress bar (primary → primary-light) inside a
clay-pressed container. Rounded ends. Subtle shimmer animation.

PAGE TRANSITION: Content fades out (opacity 0, y +10), new content fades in
(opacity 0→1, y 20→0) with spring easing. 400ms total.
```

---

## Part 3: Component Inventory (19 Claymorphism Components)

### 1. ClayProgressRing (was: AnalogGauge)
- **Visual**: Circular SVG ring on a soft clay circular base. Base is white with clay-lg shadow. Ring track is pale grey. Progress arc uses gradient (primary → primary-light for normal, warning → amber-light for warning, error → coral for critical). Large number in center (Plus Jakarta Sans 800). Label below in caption. Subtle pulse glow animation when value changes.
- **States**: Normal (indigo ring), Warning (amber ring), Critical (red ring + gentle pulse), Loading (spinning indigo arc)
- **Props**: `value: number (0-100)`, `label: string`, `size: "sm" | "md" | "lg"`, `variant?: "primary" | "warning" | "danger"`
- **Sizes**: sm=80px, md=120px, lg=180px
- **Animation**: Ring fills with spring physics. Number counts up smoothly.

### 2. ClayCard (was: LeatherFolder)
- **Visual**: White surface (#FFFFFF) with clay-md shadow. Border-radius: 20px. Subtle 1px border (rgba(0,0,0,0.04)). Inner highlight gradient at top (white → transparent). Generous padding (24px). Optional colored accent stripe along top or left edge (4px, rounded).
- **States**: Default (clay-md), Hover (lifts to clay-lg, y: -4px), Active/Selected (colored left border stripe), Loading (skeleton pulse)
- **Props**: `children: ReactNode`, `accent?: string (color)`, `onClick?: () => void`, `isSelected?: boolean`, `className?: string`
- **Sizes**: Fluid width, auto height

### 3. ComplianceOrb (was: RadarScreen)
- **Visual**: Large soft circle on cream background. Multiple concentric rings (very subtle grey). Pulsing radar ping animation (expanding ring that fades). Platform blips shown as small colored clay dots (YouTube red, Instagram pink) with tooltip labels. Center shows overall compliance percentage in large text.
- **States**: Scanning (ping animation active), All Clear (green center glow), Alert (coral ping rings), Idle (static, muted)
- **Props**: `platforms: Array<{ name: string, status: "ok" | "warn" | "alert", score: number }>`, `isScanning: boolean`
- **Sizes**: md=240px, lg=360px

### 4. ActivityFeed (was: TickerTape)
- **Visual**: Vertical scrolling list of soft pill-shaped message bubbles. Each bubble: white surface with clay-sm shadow, rounded-full (9999px border-radius on sides), icon + agent name + message. Color-coded left dot (green/amber/red). Newest at top, auto-scrolls with smooth animation. Subtle divider lines between entries.
- **States**: Live (new items slide in from top with spring), Paused (on hover), Empty ("No activity yet" with illustration)
- **Props**: `messages: Array<{ timestamp: string, agent: string, text: string, type: "info" | "success" | "warning" | "error" }>`, `maxVisible?: number`
- **Sizes**: Full width, configurable height

### 5. MusicPlayer (was: VinylPlayer)
- **Visual**: Soft rounded card (clay-md). Album art circle (120px, clay-sm shadow) with track info beside it. Waveform visualization bar (thin rounded bars bouncing). Play/pause button (circular, clay-sm, primary color). Progress bar (thin, primary gradient, rounded). Track name in subhead, artist in caption.
- **States**: Stopped (static waveform), Playing (bars bounce, progress moves), Loading (pulsing)
- **Props**: `trackName: string`, `artistName?: string`, `isPlaying: boolean`, `onPlayPause: () => void`, `variant?: "original" | "alternative"`
- **Sizes**: Full width card, ~100px height

### 6. AccordionDrawer (was: FilingCabinet)
- **Visual**: Stacked expandable sections. Each section header: white clay-sm row with rounded corners, icon + label + chevron. On expand: content slides down with spring animation, indent 16px. Smooth height transition. Active section has colored left accent.
- **States**: Collapsed (chevron right), Expanded (chevron down, content visible), Hover (slight lift)
- **Props**: `sections: Array<{ label: string, icon?: ReactNode, children: ReactNode }>`, `allowMultiple?: boolean`
- **Sizes**: Full width

### 7. VoiceWave (was: VUMeter)
- **Visual**: Horizontal row of 5-7 thin rounded bars that bounce with audio level. Inside a soft clay-sm container. Primary color gradient on bars. Microphone icon button beside it (circular, clay-sm). "Listening..." text appears when active.
- **States**: Idle (bars at minimum height), Active (bars bounce with audio amplitude), Processing (bars pulse uniformly)
- **Props**: `level: number (0-100)`, `isActive: boolean`, `onMicClick: () => void`
- **Sizes**: 200px × 48px

### 8. StatusBadge (was: StampBadge)
- **Visual**: Soft rounded pill shape. Clay-sm shadow. Colored background matching status (pale tint). Bold text + optional icon. Subtle inner highlight. Appears with bouncy pop animation (scale 0→1.15→1).
- **Variants**:
  - Approved: mint pale bg, mint text, ✓ icon
  - Flagged: amber pale bg, amber text, ⚠ icon
  - Critical: coral pale bg, red text, ✕ icon
  - Pending: grey pale bg, grey text, ◯ icon
  - Info: indigo pale bg, indigo text, ℹ icon
- **Props**: `type: "approved" | "flagged" | "critical" | "pending" | "info"`, `text?: string`, `size?: "sm" | "md"`
- **Sizes**: sm=24px h, md=32px h

### 9. ClayToggle (was: ToggleSwitch)
- **Visual**: Rounded track (48px × 28px). Track has clay-pressed shadow (recessed). Circular thumb (22px) with clay-sm shadow (raised). OFF: track is bg-tertiary, thumb on left. ON: track slides to primary color, thumb slides right with spring bounce. Smooth 200ms transition.
- **States**: Off (grey), On (primary colored), Disabled (muted, no interaction)
- **Props**: `checked: boolean`, `onChange: (checked: boolean) => void`, `label?: string`, `disabled?: boolean`
- **Sizes**: 48px × 28px

### 10. ClayButton (was: MetalButton)
- **Visual**: Rounded rectangle (radius-md: 16px). Clay-sm shadow for raised 3D look. Inner top highlight (white gradient). On press: scales to 0.96, shadow switches to clay-pressed (squishes into surface). Subtle background gradient. Icon optional left of text.
- **Variants**:
  - Primary: indigo gradient bg, white text, clay-primary shadow
  - Secondary: white bg, primary text, clay-sm shadow
  - Danger: red gradient bg, white text, clay-danger shadow
  - Ghost: transparent bg, text only, no shadow, hover → bg-tertiary
- **States**: Default (raised), Hover (scale 1.02, lift), Active (squish down), Disabled (50% opacity), Loading (spinner replaces text)
- **Props**: `label: string`, `onClick: () => void`, `icon?: ReactNode`, `variant`, `size: "sm" | "md" | "lg"`, `isLoading?: boolean`, `disabled?: boolean`
- **Sizes**: sm=36px h, md=44px h, lg=52px h

### 11. ContentCard (was: PaperDocument)
- **Visual**: White card with clay-md shadow. Rounded corners (20px). Optional header section with pale colored background. Body with comfortable padding (24px). Clean typography: Plus Jakarta Sans headings, Inter body. Optional footer with action buttons.
- **States**: Default, Hover (lifts), Selected (primary left border), Expandable (click to show more)
- **Props**: `title?: string`, `subtitle?: string`, `children: ReactNode`, `footer?: ReactNode`, `headerColor?: string`
- **Sizes**: Fluid

### 12. StatusDot (was: NeonIndicator)
- **Visual**: Small circle (10-14px) with soft colored glow shadow. Inside a subtle clay ring. Colors match status system.
- **States**: Active (colored glow), Inactive (grey, no glow), Pulsing (slow opacity oscillation)
- **Props**: `status: "active" | "warning" | "error" | "inactive"`, `pulse?: boolean`, `size?: "sm" | "md"`
- **Sizes**: sm=10px, md=14px

### 13. SidePanel (was: WoodPanel)
- **Visual**: Soft cream background (bg-secondary). Left border with subtle clay-md shadow cast right. Smooth rounded edges only on right side. Generous padding. Logo at top, nav items below, footer at bottom.
- **Props**: `children: ReactNode`

### 14. GlassOverlay (was: GlassPanel)
- **Visual**: Semi-transparent white (rgba(255,255,255,0.7)) with backdrop-blur(20px). Soft rounded corners (24px). Subtle border (rgba(0,0,0,0.06)). Inner top highlight. For modals, overlays, secondary panels.
- **Props**: `children: ReactNode`, `onClose?: () => void`

### 15. NotesBoard (was: CorkBoard)
- **Visual**: Soft clay-md container with rounded corners. Light warm background. Contains small note cards in a masonry/staggered grid. Each note is a colored card (pastel tints) with clay-sm shadow, slightly rotated (-2° to +2°) for organic feel. Colored dot at top of each note (like a pin).
- **Props**: `notes: Array<{ text: string, color?: string }>`

### 16. ChecklistCard (was: Clipboard)
- **Visual**: White clay-md card. Header section with title. List items with custom checkboxes (rounded squares that fill with primary color and ✓ on check, with satisfying bounce animation). Progress bar at bottom showing completion percentage.
- **Props**: `title: string`, `items: Array<{ text: string, checked: boolean }>`, `onToggle: (index: number) => void`

### 17. RangeDial (was: SteelDial)
- **Visual**: Horizontal slider with clay track (recessed, clay-pressed). Circular thumb (20px, clay-sm shadow, white). Active portion of track fills with primary gradient. Value tooltip appears above thumb on drag.
- **Props**: `value: number`, `min: number`, `max: number`, `onChange: (value: number) => void`, `label: string`

### 18. StatDisplay (was: LCDScreen)
- **Visual**: Large number in Plus Jakarta Sans 800 (hero size). Soft clay-md container. Optional trend arrow (↑ green or ↓ red) beside number. Label in caption below. Background can be tinted with pale accent color.
- **Props**: `value: string | number`, `label: string`, `trend?: "up" | "down" | "neutral"`, `tintColor?: string`

### 19. AgentStatusCard (was: StatusLight)
- **Visual**: Small clay-sm card (140px × 100px). Agent icon (emoji or 3D icon) at top. Agent name in subhead. StatusDot showing health. Active task count as small pill badge. Compact and grid-friendly.
- **Props**: `agentName: string`, `icon: string`, `status: "active" | "busy" | "idle" | "error"`, `taskCount: number`, `onToggle?: () => void`

---

## Part 4: Page Wireframes (6 Pages + Persistent Shell)

### Persistent App Shell
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌──────────┬──────────────────────────────────────────────────────────┐│
│  │          │  ┌─────────────────────────────────────────────────┐    ││
│  │  SIDEBAR │  │ Page Title              [🔔 3] [Voice 🎤] [⚙️] │    ││
│  │  (Cream  │  └─────────────────────────────────────────────────┘    ││
│  │   panel) │                                                         ││
│  │          │                                                         ││
│  │  CF logo │              SCROLLABLE CONTENT AREA                    ││
│  │          │              (Warm cream background)                    ││
│  │ 🏠 Command│                                                         ││
│  │ 📋 Contracts│                                                       ││
│  │ 🛡️ Compliance│                                                     ││
│  │ 📡 Distribution│                                                   ││
│  │ 🤖 Fleet    │                                                       ││
│  │ 📊 Reports  │                                                       ││
│  │          │                                                         ││
│  │──────────│                                                         ││
│  │ [🎤 Voice]│                                                         ││
│  │ [waves]  │                                                         ││
│  │          │                                                         ││
│  │ CREATOR  │                                                         ││
│  │ FLEET    │                                                         ││
│  └──────────┴──────────────────────────────────────────────────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Sidebar** (240px fixed): bg-secondary with clay-md shadow cast rightward. "Crewmate" in Plus Jakarta Sans 800, primary color. Nav items are rounded rows (radius-lg), hover → bg-tertiary, active → primary-pale bg + primary text + StatusDot. Bottom: VoiceWave component.

**Header**: Page title (Plus Jakarta Sans 700, 28px), notification bell (clay-sm circle) with badge count, voice trigger button, settings gear.

### Page 1: Creator Command Center (Home)
```
┌────────────────────────────────────────────────────────────────┐
│  Good afternoon, Creator 👋                                     │
│  Here's your fleet status for today.                            │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │ Compliance  │  │ Contracts  │  │  Revenue   │               │
│  │   Score     │  │  Pending   │  │ This Month │               │
│  │ [Progress   │  │ [Stat      │  │ [Stat      │               │
│  │  Ring: 73%] │  │  Display:3]│  │  Disp:$12K]│               │
│  │             │  │  ↑ +2 new  │  │  ↑ +15%    │               │
│  └────────────┘  └────────────┘  └────────────┘               │
│                                                                  │
│  Agent Fleet                                          [See All]  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │🧠        │ │📋        │ │🛡️        │ │📡        │ │📊        │ │
│  │Orchestr. │ │Contract │ │Compli.  │ │Distrib. │ │Report   │ │
│  │ 🟢 3     │ │ 🟢 1     │ │ 🟡 2     │ │ ⚫ 0     │ │ 🟢 1     │ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │💰        │ │🎯        │ │📅        │ │🔒        │              │
│  │Revenue  │ │Brand    │ │Calendar │ │Sentinel │              │
│  │ 🟢 1     │ │ 🟢 1     │ │ 🟡 2     │ │ 🟢 3     │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                  │
│  ┌──────────────────────────┐ ┌──────────────────────────────┐ │
│  │ Compliance Overview       │ │ Quick Notes                   │ │
│  │ [ComplianceOrb            │ │ [NotesBoard]                  │ │
│  │  scanning with            │ │ 📌 3 contracts due Friday     │ │
│  │  YouTube + Instagram      │ │ 📌 Instagram post @ 3pm      │ │
│  │  blips pinging]           │ │ 📌 Revenue review Monday     │ │
│  └──────────────────────────┘ └──────────────────────────────┘ │
│                                                                  │
│  Recent Activity                                                 │
│  [ActivityFeed — latest agent actions scrolling]                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 🟢 16:03 │ 📋 Contract Agent │ BrandX analysis complete    │   │
│  │ 🟡 16:01 │ 🛡️ Compliance     │ Scanning YouTube video #42  │   │
│  │ 🔴 15:58 │ 🔒 Sentinel       │ Blocked injection attempt   │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

### Page 2: Contract Analyzer
```
┌────────────────────────────────────────────────────────────────┐
│  📋 Contract Analyzer                    [ClayButton: Upload]   │
│                                                                  │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐│
│  │ CONTRACT DOCUMENT         │  │ AI ANALYSIS                   ││
│  │ [ClayCard — large]        │  │                               ││
│  │                           │  │ Risk Score                    ││
│  │ ┌─────────────────────┐  │  │ [ClayProgressRing: 67/100    ││
│  │ │ [ContentCard]        │  │  │  variant="danger" size="lg"] ││
│  │ │                      │  │  │                               ││
│  │ │ Brand Partnership    │  │  │ Clause Analysis               ││
│  │ │ Agreement            │  │  │ ┌───────────────────────────┐││
│  │ │                      │  │  │ │ § 4.2 Exclusivity         │││
│  │ │ Between: @creator    │  │  │ │ [StatusBadge: Critical]   │││
│  │ │ And: BrandX Corp     │  │  │ │ 12-month exclusivity is   │││
│  │ │                      │  │  │ │ excessive. Standard: 3-6  │││
│  │ │ [highlighted text    │  │  │ │ months for YouTube.       │││
│  │ │  in amber bg]        │  │  │ └───────────────────────────┘││
│  │ │                      │  │  │ ┌───────────────────────────┐││
│  │ └─────────────────────┘  │  │ │ § 7.1 Payment             │││
│  │                           │  │ │ [StatusBadge: Flagged]    │││
│  │ [Tabs: Terms│Rights│Pay] │  │ │ Net-90 is slow. Negotiate │││
│  └──────────────────────────┘  │ │ to Net-30.                │││
│                                  │ └───────────────────────────┘││
│  DROP ZONE (appears on drag):   │                               ││
│  "Drop your contract PDF here"  │ Revenue Insight               ││
│   with bouncing arrow icon      │ Deal: $5K │ Market: $6.2K    ││
│                                  │ [StatusBadge: 19% Below]     ││
│                                  │                               ││
│                                  │ [ClayButton: Generate Report]││
│                                  │ [ClayButton: Counter-Proposal││
│                                  └──────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```

### Page 3: Compliance Radar
```
┌────────────────────────────────────────────────────────────────┐
│  🛡️ Compliance Radar                  [ClayToggle: Auto-Scan]  │
│                                                                  │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐│
│  │ COMPLIANCE OVERVIEW       │  │ PLATFORM STATUS               ││
│  │ [ComplianceOrb — large]   │  │                               ││
│  │                           │  │ YouTube                       ││
│  │  Scanning continuously    │  │ [ChecklistCard]               ││
│  │  ● YouTube (green)        │  │ ☑ FTC Disclosure: Present    ││
│  │  ◉ Instagram (amber)     │  │ ☑ Community Guidelines: OK   ││
│  │                           │  │ ⚠ Copyright: 1 match found  ││
│  │ Content Category:         │  │ ☑ Branded Content: Tagged    ││
│  │ [StatusBadge: Tech Review]│  │ Score: [ProgressRing 87%]    ││
│  │ Classified by Gemma       │  │                               ││
│  └──────────────────────────┘  │ Instagram                     ││
│                                  │ [ChecklistCard]               ││
│                                  │ ☑ Branded Content Tag: Yes   ││
│                                  │ ⚠ Caption: Missing #ad       ││
│                                  │ ☑ Image Rights: Original     ││
│                                  │ Score: [ProgressRing 72%]    ││
│                                  └──────────────────────────────┘│
│                                                                  │
│  🎵 Music Copyright — Alternatives (Lyria)                       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ ORIGINAL     │ │ ALTERNATIVE 1│ │ ALTERNATIVE 2│            │
│  │ ⚠ Copyrighted│ │ ✅ Royalty-Free│ │ ✅ Royalty-Free│            │
│  │[MusicPlayer] │ │[MusicPlayer] │ │[MusicPlayer] │            │
│  │"Song X"      │ │"Lyria #1"    │ │"Lyria #2"    │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
└────────────────────────────────────────────────────────────────┘
```

### Page 4: Fleet Monitor
```
┌────────────────────────────────────────────────────────────────┐
│  🤖 Fleet Monitor — 9 Agents Active                             │
│                                                                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐│
│  │🧠        │ │📋        │ │🛡️        │ │📡        │ │📊        ││
│  │Orchestr. │ │Contract │ │Comply   │ │Distrib  │ │Report   ││
│  │🟢 Active │ │🟢 Active │ │🟡 Busy  │ │⚫ Idle   │ │🟢 Ready  ││
│  │Tasks: 3  │ │Tasks: 1  │ │Tasks: 2  │ │Tasks: 0  │ │Tasks: 1  ││
│  │[Toggle]  │ │[Toggle]  │ │[Toggle]  │ │[Toggle]  │ │[Toggle]  ││
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘│
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │💰        │ │🎯        │ │📅        │ │🔒        │              │
│  │Revenue  │ │Brand    │ │Calendar │ │Sentinel │              │
│  │🟢 Active │ │🟢 Active │ │🟡 Busy  │ │🟢 Watch  │              │
│  │Tasks: 1  │ │Tasks: 1  │ │Tasks: 2  │ │Blocks: 3│              │
│  │[Toggle]  │ │[Toggle]  │ │[Toggle]  │ │[Toggle]  │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                  │
│  Agent Reasoning Trace                                           │
│  [ActivityFeed — expanded, multi-line]                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 🟢 16:03:22 │ 🧠 Orchestrator │ Delegating contract-review│   │
│  │              │                 │ → ContractAgent (cx-42)   │   │
│  │ 🟢 16:03:24 │ 📋 ContractAgent│ Tool: extract_clauses     │   │
│  │ 🟢 16:03:28 │ 📋 ContractAgent│ Found 14 clauses, 3 HIGH  │   │
│  │ 🟢 16:03:29 │ 🔒 Sentinel     │ Model Armor: output clean │   │
│  │ 🟢 16:03:30 │ 🧠 Orchestrator │ Routing → ReportAgent     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Memory Bank                                                     │
│  [AccordionDrawer]                                               │
│  ▼ BrandX History (3 contracts, avg deal $4.5K)                 │
│  ▶ BrandY History                                                │
│  ▶ My Preferences                                                │
│  ▶ Content Patterns                                              │
└────────────────────────────────────────────────────────────────┘
```

### Page 5: Distribution Hub
```
┌────────────────────────────────────────────────────────────────┐
│  📡 Distribution Hub                    [ClayButton: Publish]   │
│                                                                  │
│  ┌─────────────────────────────┐ ┌────────────────────────────┐│
│  │ Platform Readiness           │ │ Content Calendar            ││
│  │                              │ │ [ClayCard with weekly grid] ││
│  │ YouTube                      │ │                             ││
│  │ [ClayProgressRing 92%]      │ │  Mon Tue Wed Thu Fri Sat Sun││
│  │ [ChecklistCard]              │ │      🔴       🟣       🔴  ││
│  │ ✅ Title optimized (SEO)     │ │      YT       IG       YT  ││
│  │ ✅ Description generated     │ │     14:00   15:00    10:00 ││
│  │ ✅ Tags: 15 suggested        │ │                             ││
│  │ ✅ Thumbnail: Reviewed       │ │ Optimal Timing              ││
│  │ ✅ Captions: Ready           │ │ (Audience Agent says:)      ││
│  │                              │ │ YouTube: Tue/Sat 2-4pm     ││
│  │ Instagram                    │ │ Instagram: Thu 3-5pm       ││
│  │ [ClayProgressRing 78%]      │ │                             ││
│  │ [ChecklistCard]              │ │ Metadata Preview            ││
│  │ ✅ Aspect ratio: OK          │ │ [ContentCard]               ││
│  │ ⚠️ Caption: Missing #ad      │ │ Title: "Best Camera 2026"  ││
│  │ ✅ Hashtags: 20 generated    │ │ Tags: #tech #camera        ││
│  │ ⚠️ Story version needed      │ │ Desc: "In this video..."   ││
│  │                              │ │                             ││
│  │ [ClayToggle: Auto-Publish]  │ │ [ClayButton: Generate Meta]││
│  │ [ClayToggle: Cross-Post]    │ │ [ClayButton: Schedule]     ││
│  └─────────────────────────────┘ └────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```

### Page 6: Reports Center
```
┌────────────────────────────────────────────────────────────────┐
│  📊 Reports Center                                              │
│                                                                  │
│  ┌────────────────┐  ┌────────────────────────────────────────┐│
│  │ Report Archive  │  │ Report Preview                         ││
│  │[AccordionDrawer]│  │ [ContentCard — large]                  ││
│  │                 │  │                                        ││
│  │ ▼ August 2026   │  │ ┌────────────────────────────────────┐││
│  │   📄 BrandX     │  │ │                                    │││
│  │   📄 Weekly     │  │ │  CREATORFLEET COMPLIANCE REPORT    │││
│  │   📄 Monthly    │  │ │                                    │││
│  │                 │  │ │  Creator: @username                │││
│  │ ▶ July 2026    │  │ │  Period: Aug 15-22, 2026           │││
│  │ ▶ June 2026    │  │ │                                    │││
│  │                 │  │ │  Compliance Score: 73/100          │││
│  │                 │  │ │  [ClayProgressRing inline]         │││
│  │                 │  │ │                                    │││
│  │                 │  │ │  Risks Found: 3                   │││
│  │ Video Summaries │  │ │  Auto-Resolved: 2                 │││
│  │ (Veo Generated) │  │ │  Manual Review: 1                 │││
│  │ ▶ BrandX Brief  │  │ │                                    │││
│  │ ▶ Monthly Recap │  │ │  [StatusBadge: ⚠ NEEDS REVIEW]    │││
│  │                 │  │ └────────────────────────────────────┘││
│  │                 │  │                                        ││
│  │                 │  │ [ClayButton: Export PDF]               ││
│  │                 │  │ [ClayButton: Send to Brand]           ││
│  │                 │  │ [ClayButton: Generate Video (Veo)]    ││
│  └────────────────┘  └────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```

---

## Part 5: Multimodal UX

### Voice Interface
- **Location**: Bottom of sidebar (always visible) + header icon
- **Components**: VoiceWave + circular ClayButton (mic icon, primary color)
- **Flow**: Click mic → button pulses primary → VoiceWave bars bounce → text appears in ActivityFeed as "🎤 You: [command]" → agent response follows
- **Visual**: When recording, mic button gets clay-primary glow shadow, wave bars bounce in primary color, "Listening..." caption appears

### File Upload (Drag & Drop)
- **Trigger**: Drag file over Contract Analyzer page
- **Visual**: Full-page GlassOverlay fades in. Center: large dashed-border rounded rectangle (clay-pressed) with bouncing ↓ arrow icon and "Drop your contract PDF here" text in Plus Jakarta Sans 600. File type pills below (.pdf, .doc).
- **On Drop**: Rectangle fills with primary-pale, ✓ appears, progress ring fills, navigates to analysis view

### Real-Time Updates (WebSocket)
- **ActivityFeed**: New messages slide in from top with spring animation
- **AgentStatusCards**: StatusDots transition color smoothly
- **ClayProgressRings**: Animate smoothly when values change
- **ComplianceOrb**: New pings expand outward when scans complete
- **Notifications**: Toast slides in from right, auto-dismisses after 5s

### Transitions & Loading
- **Page transitions**: Content fades out (opacity 0, y: +10px), new content fades in (opacity 0→1, y: 20→0) — 400ms
- **Skeleton states**: Clay-shaped rounded rectangles pulsing between bg-secondary and bg-tertiary
- **Loading spinner**: 3 bouncing dots in primary/secondary/accent colors
- **Empty states**: Friendly illustration + "No [items] yet" text + ClayButton to create first one

---

## Part 6: The Figma Master Prompt

> **Copy everything below and paste into Claude Opus 4.8 in Figma Build Mode**

---

```text
You are a world-class UI/UX designer and senior frontend engineer. Design and build the complete frontend for "Crewmate" — a beautiful, award-winning enterprise AI agent dashboard for content creators. This must win "Best Multimodal UX" at a major hackathon.

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
  - "Crewmate" logo: Plus Jakarta Sans 800, primary color (#6366F1), 20px
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
Right (65%): Large ContentCard showing report preview — header with "Crewmate Compliance Report" title, creator name, period, inline ClayProgressRing for score, risk summary table, StatusBadge for overall status. Action buttons: ClayButton "Export PDF", ClayButton "Send to Brand", ClayButton "Generate Video (Veo)".

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
- Page titles: "Crewmate — [Page Name]"
- Light theme ONLY (no dark mode toggle needed)
- Generous whitespace everywhere — premium = breathing room

Make it beautiful. Make it soft. Make it feel like touching clouds. Make it win.
```
