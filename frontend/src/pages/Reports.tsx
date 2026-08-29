import { useState } from "react"
import {
  AccordionDrawer,
  ClayButton,
  ClayProgressRing,
  ContentCard,
  StatusBadge,
  type DrawerSection,
} from "../components/clay"
import Section from "../components/layout/Section"
import { ACTION_ICONS, SECTION_ICONS, PlayIcon } from "../lib/icons"

const ARCHIVE: DrawerSection[] = [
  {
    id: "aug",
    icon: SECTION_ICONS.calendar,
    label: "August 2026",
    accent: "var(--primary)",
    content: (
      <ul className="flex flex-col gap-2 text-[13px]">
        <li className="flex justify-between">
          <span>BrandX Compliance Report</span>
          <span className="text-text-tertiary">Aug 20</span>
        </li>
        <li className="flex justify-between">
          <span>Monthly Fleet Summary</span>
          <span className="text-text-tertiary">Aug 01</span>
        </li>
      </ul>
    ),
  },
  {
    id: "jul",
    icon: SECTION_ICONS.calendar,
    label: "July 2026",
    content: (
      <ul className="flex flex-col gap-2 text-[13px]">
        <li className="flex justify-between">
          <span>BrandY Compliance Report</span>
          <span className="text-text-tertiary">Jul 18</span>
        </li>
      </ul>
    ),
  },
  {
    id: "veo",
    icon: SECTION_ICONS.video,
    label: "Video Summaries (Veo)",
    accent: "var(--secondary)",
    content: (
      <ul className="flex flex-col gap-2 text-[13px]">
        {["August recap · 0:48", "July recap · 0:52"].map((v) => (
          <li
            key={v}
            className="clay-sm flex items-center justify-between rounded-xl bg-surface px-3 py-2"
          >
            <span>{v}</span>
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-white"
              style={{ background: "var(--secondary)" }}
            >
              <PlayIcon size={16} />
            </span>
          </li>
        ))}
      </ul>
    ),
  },
]

const RISK_ROWS = [
  {
    area: "Contract Terms",
    status: "critical" as const,
    note: "1 critical clause",
  },
  {
    area: "YouTube Compliance",
    status: "flagged" as const,
    note: "Copyright flag resolved",
  },
  {
    area: "Instagram Compliance",
    status: "flagged" as const,
    note: "Caption disclosure",
  },
  {
    area: "Revenue Fairness",
    status: "critical" as const,
    note: "19% below market",
  },
  {
    area: "Content Guidelines",
    status: "approved" as const,
    note: "All checks passed",
  },
]

export default function Reports() {
  const [exporting, setExporting] = useState(false)
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[35fr_65fr]">
      <ContentCard
        title="Report Archive"
        subtitle="Compliance history & video recaps"
      >
        <AccordionDrawer sections={ARCHIVE} allowMultiple />
      </ContentCard>

      <ContentCard
        headerColor="var(--primary)"
        title="Crewmate Compliance Report"
        subtitle="BrandX Partnership · August 2026"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-text-secondary">Prepared for</p>
              <p
                className="text-lg font-bold text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Creator × BrandX Inc.
              </p>
              <p className="text-xs text-text-tertiary">
                Reporting period: Aug 1 – Aug 22, 2026
              </p>
              <div className="mt-3">
                <StatusBadge type="flagged" text="Action Required" />
              </div>
            </div>
            <ClayProgressRing
              value={68}
              label="Overall score"
              size="md"
              variant="warning"
            />
          </div>

          <div
            className="clay-inset overflow-hidden rounded-2xl"
            style={{ background: "var(--bg-secondary)" }}
          >
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="text-text-tertiary">
                  <th className="px-4 py-2.5 font-semibold">Area</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {RISK_ROWS.map((r) => (
                  <tr key={r.area} className="border-t border-black/5">
                    <td className="px-4 py-2.5 font-medium text-text-primary">
                      {r.area}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge type={r.status} text={r.status} size="sm" />
                    </td>
                    <td className="px-4 py-2.5 text-text-secondary">
                      {r.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[13px] leading-relaxed text-text-secondary">
            <b className="text-text-primary">Summary:</b> The BrandX agreement
            carries elevated risk driven by a perpetual exclusivity clause and
            below-market compensation. Copyright and disclosure issues have been
            auto-remediated. We recommend issuing the drafted counter-proposal
            before signing.
          </p>

          <div className="flex flex-wrap gap-2.5">
            <ClayButton
              label="Export PDF"
              variant="primary"
              icon={ACTION_ICONS.file}
              isLoading={exporting}
              onClick={() => {
                setExporting(true)
                setTimeout(() => setExporting(false), 1500)
              }}
            />
            <ClayButton
              label="Send to Brand"
              variant="secondary"
              icon={ACTION_ICONS.upload}
            />
            <ClayButton
              label="Generate Video (Veo)"
              variant="accent"
              icon={ACTION_ICONS.video}
            />
          </div>
        </div>
      </ContentCard>
    </div>
  )
}
