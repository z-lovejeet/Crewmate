import { useState } from "react"
import {
  ChecklistCard,
  ClayCard,
  ClayProgressRing,
  ClayToggle,
  ComplianceOrb,
  MusicPlayer,
  StatusBadge,
  type ChecklistItem,
} from "../components/clay"
import Section from "../components/layout/Section"

const YT_INIT: ChecklistItem[] = [
  { id: "y1", label: "FTC disclosure present", checked: true },
  {
    id: "y2",
    label: "Copyright — background music",
    checked: false,
    warn: true,
  },
  { id: "y3", label: "Community guidelines", checked: true },
  { id: "y4", label: "Branded content flag", checked: true },
]

const IG_INIT: ChecklistItem[] = [
  { id: "i1", label: "Branded content tag", checked: true },
  { id: "i2", label: "Caption disclosure", checked: false, warn: true },
  { id: "i3", label: "Image rights cleared", checked: true },
  { id: "i4", label: "Hashtag compliance", checked: true },
]

export default function Compliance() {
  const [yt, setYt] = useState(YT_INIT)
  const [ig, setIg] = useState(IG_INIT)
  const [autoScan, setAutoScan] = useState(true)
  const [playing, setPlaying] = useState<string | null>(null)

  const toggle = (setter: typeof setYt) => (id: string) =>
    setter((l) =>
      l.map((x) =>
        x.id === id ? { ...x, checked: !x.checked, warn: false } : x,
      ),
    )

  const play = (id: string) => setPlaying((p) => (p === id ? null : id))

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[40fr_60fr]">
        <ClayCard>
          <div className="mb-2 flex items-center justify-between">
            <h3
              className="text-base font-bold text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Live Scan
            </h3>
            <ClayToggle
              checked={autoScan}
              onChange={setAutoScan}
              label="Auto-Scan"
            />
          </div>
          <div className="flex flex-col items-center gap-5 py-4">
            <ComplianceOrb
              isScanning={autoScan}
              score={80}
              size={260}
              platforms={[
                { name: "YouTube", color: "var(--youtube)" },
                { name: "Instagram", color: "var(--instagram)" },
              ]}
            />
            <StatusBadge type="info" text="Tech Review — classified by Gemma" />
          </div>
        </ClayCard>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ChecklistCard
            title="YouTube"
            items={yt}
            onToggle={toggle(setYt)}
            headerRight={
              <ClayProgressRing value={87} size="sm" variant="primary" />
            }
          />
          <ChecklistCard
            title="Instagram"
            items={ig}
            onToggle={toggle(setIg)}
            headerRight={
              <ClayProgressRing value={72} size="sm" variant="warning" />
            }
          />
        </div>
      </div>

      <ClayCard>
        <Section
          title="Music Copyright"
          hint="Copyright agent + Lyria alternatives"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <MusicPlayer
              trackName="Neon Skyline"
              artist="Original track"
              isPlaying={playing === "m1"}
              onPlayPause={() => play("m1")}
              variant="original"
              badge="Copyright risk"
            />
            <MusicPlayer
              trackName="Neon Skyline (Alt 1)"
              artist="Generated · Lyria"
              isPlaying={playing === "m2"}
              onPlayPause={() => play("m2")}
              variant="alternative"
              badge="Cleared · Lyria"
            />
            <MusicPlayer
              trackName="Neon Skyline (Alt 2)"
              artist="Generated · Lyria"
              isPlaying={playing === "m3"}
              onPlayPause={() => play("m3")}
              variant="alternative"
              badge="Cleared · Lyria"
            />
          </div>
        </Section>
      </ClayCard>
    </div>
  )
}
