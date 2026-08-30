import type { ComponentType, ReactNode } from "react"

export interface PageHeaderProps {
  icon?: ComponentType<{ size?: number className?: string }> | ReactNode
  kicker?: string
  title: string
  subtitle: string
  badgeText?: string
  badgeTone?: "success" | "info" | "warning" | "accent" | "primary"
  badgeIcon?: ReactNode
  actions?: ReactNode
}

export function PageHeader({
  icon: Icon,
  kicker,
  title,
  subtitle,
  badgeText,
  badgeTone = "primary",
  badgeIcon,
  actions,
}: PageHeaderProps) {
  const toneClasses = {
    primary: "bg-primary-pale text-primary border-primary/20",
    success: "bg-accent-pale text-accent border-accent/20",
    warning: "bg-warning-pale text-warning border-warning/20",
    info: "bg-blue-50 text-blue-600 border-blue-200",
    accent: "bg-accent-pale text-accent border-accent/20",
  }

  const dotClasses = {
    primary: "bg-primary",
    success: "bg-accent",
    warning: "bg-warning",
    info: "bg-blue-600",
    accent: "bg-accent",
  }

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="clay-sm flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-surface sm:h-16 sm:w-16">
            <span className="flex items-center justify-center text-primary [&>svg]:h-7 [&>svg]:w-7 sm:[&>svg]:h-8 sm:[&>svg]:w-8">
              {typeof Icon === "function" ? <Icon size={28} /> : Icon}
            </span>
          </div>
        )}
        <div className="flex flex-col">
          {kicker && (
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary/80">
              {kicker}
            </span>
          )}
          <h1
            className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h1>
          <p className="mt-0.5 text-sm font-medium text-text-secondary sm:text-base">
            {subtitle}
          </p>
        </div>
      </div>

      {(badgeText || actions) && (
        <div className="flex flex-wrap items-center gap-3 pl-18 sm:pl-0">
          {badgeText && (
            <div
              className={`clay-sm flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${toneClasses[badgeTone]}`}
            >
              {badgeIcon || (
                <span
                  className={`h-2 w-2 rounded-full ${dotClasses[badgeTone]}`}
                />
              )}
              <span>{badgeText}</span>
            </div>
          )}
          {actions}
        </div>
      )}
    </div>
  )
}
