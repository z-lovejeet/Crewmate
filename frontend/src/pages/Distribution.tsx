import { useState } from "react"
import {
  ChecklistCard,
  ClayButton,
  ClayCard,
  ClayProgressRing,
  ClayToggle,
  ContentCard,
  StatusBadge,
  type ChecklistItem,
} from "../components/clay"
import Section from "../components/layout/Section"
import { ACTION_ICONS, UserGroup03Icon } from "../lib/icons"

const YT: ChecklistItem[] = [
  { id: "y1", label: "Thumbnail uploaded", checked: true },
  { id: "y2", label: "Title & tags optimized", checked: true },
  { id: "y3", label: "End screen configured", checked: false, warn: true },
  { id: "y4", label: "Captions generated", checked: true },
]
const IG: ChecklistItem[] = [
  { id: "i1", label: "Cover frame selected", checked: true },
  { id: "i2", label: "Caption drafted", checked: true },
  { id: "i3", label: "Location & tags", checked: false, warn: true },
  { id: "i4", label: "First comment prepped", checked: true },
]

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const CAL: Record<string, { p: string color: string time: string }[]> = {
  Tue: [{ p: "IG", color: "var(--instagram)", time: "11:00" }],
  Thu: [
    { p: "YT", color: "var(--youtube)", time: "18:00" },
    { p: "IG", color: "var(--instagram)", time: "19:30" },
  ],
  Sat: [{ p: "YT", color: "var(--youtube)", time: "10:00" }],
}

export default function Distribution() {
  const [yt, setYt] = useState(YT)
  const [ig, setIg] = useState(IG)
  const [autoPublish, setAutoPublish] = useState(true)
  const [crossPost, setCrossPost] = useState(false)
  const [gen, setGen] = useState(false)

  const toggle = (setter: typeof setYt) => (id: string) =>
    setter((l) =>
      l.map((x) =>
        x.id === id ? { ...x, checked: !x.checked, warn: false } : x,
      ),
    )

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[40fr_60fr]">
      <div className="flex flex-col gap-5">
        <ClayCard>
          <Section title="Platform Readiness">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <ClayProgressRing value={92} size="sm" variant="accent" />
                <div className="flex-1">
                  <ChecklistCard
                    title="YouTube"
                    items={yt}
                    onToggle={toggle(setYt)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ClayProgressRing value={78} size="sm" variant="warning" />
                <div className="flex-1">
                  <ChecklistCard
                    title="Instagram"
                    items={ig}
                    onToggle={toggle(setIg)}
                  />
                </div>
              </div>
            </div>
          </Section>
          <div className="mt-5 flex flex-col gap-3 border-t border-black/5 pt-4">
            <ClayToggle
              checked={autoPublish}
              onChange={setAutoPublish}
              label="Auto-Publish when ready"
            />
            <ClayToggle
              checked={crossPost}
              onChange={setCrossPost}
              label="Cross-Post to all platforms"
            />
          </div>
        </ClayCard>
      </div>

      <div className="flex flex-col gap-5">
        <ClayCard>
          <Section title="Content Calendar" hint="This week's schedule">
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="clay-inset flex min-h-24 flex-col gap-1.5 rounded-xl p-2"
                  style={{ background: "var(--bg-secondary)" }}
                >
                  <span
                    className="text-center text-[11px] font-bold text-text-tertiary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {d}
                  </span>
                  {(CAL[d] ?? []).map((e, i) => (
                    <div
                      key={i}
                      className="clay-sm flex items-center gap-1 rounded-lg bg-surface px-1.5 py-1"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: e.color }}
                      />
                      <span className="text-[10px] font-semibold text-text-secondary">
                        {e.time}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div
              className="clay-inset mt-4 flex items-center gap-3 rounded-2xl p-3.5"
              style={{ background: "var(--primary-pale)" }}
            >
              <span className="text-primary flex items-center justify-center">
                <UserGroup03Icon size={20} />
              </span>
              <p className="text-[13px] text-text-primary">
                <b>Audience Agent:</b> Post Thursday 6:00 PM for +14% projected
                reach.
              </p>
            </div>
          </Section>
        </ClayCard>

        <ContentCard
          title="Metadata Preview"
          subtitle="Draft — Distribution agent"
        >
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase text-text-tertiary">
                Title
              </p>
              <p className="text-sm font-semibold text-text-primary">
                I Tested 7 AI Gadgets So You Don't Have To
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-text-tertiary">
                Tags
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {["#ai", "#gadgets", "#techreview", "#2026"].map((t) => (
                  <span
                    key={t}
                    className="clay-sm rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-primary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-text-tertiary">
                Description
              </p>
              <p className="text-[13px] text-text-secondary">
                A hands-on breakdown of this year's most hyped AI hardware —
                what's worth your money and what's just marketing. #ad in
                partnership with BrandX.
              </p>
            </div>
            <StatusBadge type="approved" text="Disclosure included" size="sm" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <ClayButton
              label="Generate Metadata"
              variant="secondary"
              icon={ACTION_ICONS.sparkle}
              isLoading={gen}
              onClick={() => {
                setGen(true)
                setTimeout(() => setGen(false), 1400)
              }}
            />
            <ClayButton
              label="Schedule"
              variant="primary"
              icon={ACTION_ICONS.calendar}
            />
          </div>
        </ContentCard>
      </div>
    </div>
  )
}
