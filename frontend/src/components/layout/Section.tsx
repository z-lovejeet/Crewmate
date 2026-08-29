import type { ReactNode } from "react"

interface Props {
  title: string
  hint?: string
  right?: ReactNode
  children: ReactNode
}

export default function Section({ title, hint, right, children }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-black/[0.04] pb-2">
        <div>
          <h2
            className="text-xl font-extrabold tracking-tight text-text-primary sm:text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h2>
          {hint && (
            <p className="mt-0.5 text-xs font-medium text-text-tertiary sm:text-sm">
              {hint}
            </p>
          )}
        </div>
        {right && <div className="flex items-center gap-2">{right}</div>}
      </div>
      {children}
    </section>
  )
}
