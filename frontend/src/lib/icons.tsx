// Crewmate — central icon mapping.
// Hugeicons: HugeiconsIcon wrapper + icon data from @hugeicons/core-free-icons
// Fallback: @phosphor-icons/react | Trend arrows: lucide-react
import type { ReactNode, ComponentType } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

import {
  Home04Icon as Home04Data,
  DocumentAttachmentIcon as DocumentAttachmentData,
  Shield01Icon as Shield01Data,
  Satellite01Icon as Satellite01Data,
  BotIcon as BotData,
  Analytics01Icon as Analytics01Data,
  NotificationCircleIcon as NotificationCircleData,
  Mic01Icon as Mic01Data,
  Settings01Icon as Settings01Data,
  MenuSquareIcon as MenuSquareData,
  CheckmarkSquare03Icon as CheckmarkSquare03Data,
  Alert02Icon as Alert02Data,
  InformationCircleIcon as InformationCircleData,
  ComingSoon02Icon as ComingSoon02Data,
  CompassIcon as CompassData,
  Scroll01Icon as Scroll01Data,
  MusicNote01Icon as MusicNote01Data,
  UserGroup03Icon as UserGroup03Data,
  Cash02Icon as Cash02Data,
  AiBrain01Icon as AiBrain01Data,
  File01Icon as File01Data,
  Edit03Icon as Edit03Data,
  DownloadSquare01Icon as DownloadSquare01Data,
  UploadSquare01Icon as UploadSquare01Data,
  Calendar03Icon as Calendar03Data,
  PlayIcon as PlayData,
  PauseIcon as PauseData,
  Building05Icon as Building05Data,
  Store04Icon as Store04Data,
  StarIcon as StarData,
  AutoConversationsIcon as AutoConversationsData,
  Rocket01Icon as Rocket01Data,
  LockedIcon as LockedData,
  ZapIcon as ZapData,
  ViewIcon as ViewData,
  LayersLogoIcon as LayersLogoData,
  GlobeIcon as GlobeData,
  VideoAiIcon as VideoAiData,
  AiSearch01Icon as AiSearch01Data,
  PencilEdit01Icon as PencilEdit01Data,
  ScissorsIcon as ScissorsData,
  Comment01Icon as Comment01Data,
  Copy01Icon as Copy01Data,
} from "@hugeicons/core-free-icons"

import {
  XIcon,
  XCircle as XCircleIcon,
  ChartBar as ChartBarIcon,
  Sparkle as SparkleIcon,
  CaretLineRight as CaretLineRightIcon,
} from "@phosphor-icons/react"

import { TrendingUp, TrendingDown } from "lucide-react"

// ─── Helper: create a React component from icon data ─────
function makeIcon(data: IconSvgElement, defaultSize = 20) {
  const Comp = ({
    size = defaultSize,
    className,
  }: {
    size?: number
    className?: string
  }) => <HugeiconsIcon icon={data} size={size} className={className} />
  Comp.displayName = "HugeIcon"
  return Comp
}

// ─── Typed Hugeicons wrapper components ──────────────────
export const Home04Icon = makeIcon(Home04Data)
export const DocumentAttachmentIcon = makeIcon(DocumentAttachmentData)
export const Shield01Icon = makeIcon(Shield01Data)
export const Satellite01Icon = makeIcon(Satellite01Data)
export const BotIconComp = makeIcon(BotData)
export const Analytics01Icon = makeIcon(Analytics01Data)
export const NotificationCircleIcon = makeIcon(NotificationCircleData)
export const Mic01Icon = makeIcon(Mic01Data)
export const Settings01Icon = makeIcon(Settings01Data)
export const MenuSquareIcon = makeIcon(MenuSquareData)
export const CompassIcon = makeIcon(CompassData)
export const Scroll01Icon = makeIcon(Scroll01Data)
export const MusicNote01Icon = makeIcon(MusicNote01Data)
export const UserGroup03Icon = makeIcon(UserGroup03Data)
export const Cash02Icon = makeIcon(Cash02Data)
export const AiBrain01Icon = makeIcon(AiBrain01Data)
export const Building05Icon = makeIcon(Building05Data)
export const Store04Icon = makeIcon(Store04Data)
export const StarIcon = makeIcon(StarData)
export const DownloadSquare01Icon = makeIcon(DownloadSquare01Data)
export const UploadSquare01Icon = makeIcon(UploadSquare01Data)
export const VideoAiIcon = makeIcon(VideoAiData)
export const Rocket01Icon = makeIcon(Rocket01Data)
export const LockedIcon = makeIcon(LockedData)
export const ZapIcon = makeIcon(ZapData)
export const ViewIcon = makeIcon(ViewData)
export const LayersLogoIcon = makeIcon(LayersLogoData)
export const GlobeIcon = makeIcon(GlobeData)
export const PlayIcon = makeIcon(PlayData)
export const PauseIcon = makeIcon(PauseData)
export const CheckmarkSquare03Icon = makeIcon(CheckmarkSquare03Data)
export const Alert02Icon = makeIcon(Alert02Data)
export const InformationCircleIcon = makeIcon(InformationCircleData)
export const ComingSoon02Icon = makeIcon(ComingSoon02Data)
export const File01Icon = makeIcon(File01Data)
export const Edit03Icon = makeIcon(Edit03Data)
export const Calendar03Icon = makeIcon(Calendar03Data)
export const AutoConversationsIcon = makeIcon(AutoConversationsData)
export const AiSearch01Icon = makeIcon(AiSearch01Data)
export const PencilEdit01Icon = makeIcon(PencilEdit01Data)
export const ScissorsIcon = makeIcon(ScissorsData)
export const Comment01Icon = makeIcon(Comment01Data)
export const Copy01Icon = makeIcon(Copy01Data)

// ─── Nav icons (as components) ───────────────────────────
export const NAV_ICONS: Record<string, ComponentType<{
  size?: number
  className?: string
}>> = {
  command: makeIcon(Home04Data),
  trends: makeIcon(Satellite01Data),
  scripts: makeIcon(PencilEdit01Data),
  media: makeIcon(ScissorsData),
  contracts: makeIcon(DocumentAttachmentData),
  compliance: makeIcon(Shield01Data),
  fleet: makeIcon(BotData),
  channel: makeIcon(AiBrain01Data),
  reports: makeIcon(Analytics01Data),
}

// ─── Status badge icons ─────────────────────────────────
export const BADGE_ICONS: Record<string, ReactNode> = {
  approved: <HugeiconsIcon icon={CheckmarkSquare03Data} size={14} />,
  flagged: <HugeiconsIcon icon={Alert02Data} size={14} />,
  critical: <XCircleIcon size={14} />,
  pending: <HugeiconsIcon icon={ComingSoon02Data} size={14} />,
  info: <HugeiconsIcon icon={InformationCircleData} size={14} />,
}

// ─── Agent icon map (keyed by agent ID) ─────────────────
export const AGENT_ICON_MAP: Record<string, ReactNode> = {
  orchestrator: <HugeiconsIcon icon={CompassData} size={22} />,
  contract_reviewer: <HugeiconsIcon icon={Scroll01Data} size={22} />,
  contract: <HugeiconsIcon icon={Scroll01Data} size={22} />,
  "contract-reviewer": <HugeiconsIcon icon={Scroll01Data} size={22} />,
  content_compliance: <HugeiconsIcon icon={Shield01Data} size={22} />,
  compliance: <HugeiconsIcon icon={Shield01Data} size={22} />,
  "content-compliance": <HugeiconsIcon icon={Shield01Data} size={22} />,
  distribution_manager: <HugeiconsIcon icon={Satellite01Data} size={22} />,
  distribution: <HugeiconsIcon icon={Satellite01Data} size={22} />,
  "distribution-manager": <HugeiconsIcon icon={Satellite01Data} size={22} />,
  report_generator: <HugeiconsIcon icon={Analytics01Data} size={22} />,
  reporter: <HugeiconsIcon icon={Analytics01Data} size={22} />,
  "report-generator": <HugeiconsIcon icon={Analytics01Data} size={22} />,
  revenue_optimizer: <HugeiconsIcon icon={Cash02Data} size={22} />,
  revenue: <HugeiconsIcon icon={Cash02Data} size={22} />,
  "revenue-optimizer": <HugeiconsIcon icon={Cash02Data} size={22} />,
  brand_safety: <HugeiconsIcon icon={Shield01Data} size={22} />,
  "brand-safety": <HugeiconsIcon icon={Shield01Data} size={22} />,
  content_calendar: <HugeiconsIcon icon={Calendar03Data} size={22} />,
  "content-calendar": <HugeiconsIcon icon={Calendar03Data} size={22} />,
  threat_sentinel: <HugeiconsIcon icon={LockedData} size={22} />,
  "threat-sentinel": <HugeiconsIcon icon={LockedData} size={22} />,
  audience_analyst: <HugeiconsIcon icon={UserGroup03Data} size={22} />,
  audience: <HugeiconsIcon icon={UserGroup03Data} size={22} />,
  "audience-analyst": <HugeiconsIcon icon={UserGroup03Data} size={22} />,
  trend_radar: <HugeiconsIcon icon={AiSearch01Data} size={22} />,
  "trend-radar": <HugeiconsIcon icon={AiSearch01Data} size={22} />,
  trends: <HugeiconsIcon icon={AiSearch01Data} size={22} />,
  hook_architect: <HugeiconsIcon icon={PencilEdit01Data} size={22} />,
  "hook-architect": <HugeiconsIcon icon={PencilEdit01Data} size={22} />,
  scripts: <HugeiconsIcon icon={PencilEdit01Data} size={22} />,
  clipping_director: <HugeiconsIcon icon={ScissorsData} size={22} />,
  "clipping-director": <HugeiconsIcon icon={ScissorsData} size={22} />,
  clips: <HugeiconsIcon icon={ScissorsData} size={22} />,
  video_cinematographer: <HugeiconsIcon icon={VideoAiData} size={22} />,
  "video-cinematographer": <HugeiconsIcon icon={VideoAiData} size={22} />,
  thumbnail_director: <HugeiconsIcon icon={ViewData} size={22} />,
  "thumbnail-director": <HugeiconsIcon icon={ViewData} size={22} />,
  community_guardian: <HugeiconsIcon icon={Comment01Data} size={22} />,
  "community-guardian": <HugeiconsIcon icon={Comment01Data} size={22} />,
  community: <HugeiconsIcon icon={Comment01Data} size={22} />,
  thumbnail_generator: <HugeiconsIcon icon={ViewData} size={22} />,
  video_editor: <HugeiconsIcon icon={VideoAiData} size={22} />,
  memory: <HugeiconsIcon icon={AiBrain01Data} size={22} />,
  copyright: <HugeiconsIcon icon={MusicNote01Data} size={22} />,
}

// ─── Feed / trace agent names → icon ─────────────────────
export const FEED_AGENT_ICON: Record<string, ReactNode> = {
  Orchestrator: <HugeiconsIcon icon={CompassData} size={16} />,
  "Fleet Orchestrator": <HugeiconsIcon icon={CompassData} size={16} />,
  "Contract Reviewer": <HugeiconsIcon icon={Scroll01Data} size={16} />,
  "Contract Analyst": <HugeiconsIcon icon={Scroll01Data} size={16} />,
  "Content Compliance": <HugeiconsIcon icon={Shield01Data} size={16} />,
  Compliance: <HugeiconsIcon icon={Shield01Data} size={16} />,
  "Distribution Manager": <HugeiconsIcon icon={Satellite01Data} size={16} />,
  Distribution: <HugeiconsIcon icon={Satellite01Data} size={16} />,
  "Report Generator": <HugeiconsIcon icon={Analytics01Data} size={16} />,
  "Revenue Optimizer": <HugeiconsIcon icon={Cash02Data} size={16} />,
  "Brand Safety": <HugeiconsIcon icon={Shield01Data} size={16} />,
  "Content Calendar": <HugeiconsIcon icon={Calendar03Data} size={16} />,
  "Threat Sentinel": <HugeiconsIcon icon={LockedData} size={16} />,
  "Audience Analyst": <HugeiconsIcon icon={UserGroup03Data} size={16} />,
  "Trend Radar": <HugeiconsIcon icon={AiSearch01Data} size={16} />,
  "Hook Architect": <HugeiconsIcon icon={PencilEdit01Data} size={16} />,
  "Clipping Director": <HugeiconsIcon icon={ScissorsData} size={16} />,
  "Video Cinematographer": <HugeiconsIcon icon={VideoAiData} size={16} />,
  "AI Video Cinematographer": <HugeiconsIcon icon={VideoAiData} size={16} />,
  "Thumbnail Director": <HugeiconsIcon icon={ViewData} size={16} />,
  "Master Thumbnail Director": <HugeiconsIcon icon={ViewData} size={16} />,
  "Community Guardian": <HugeiconsIcon icon={Comment01Data} size={16} />,
  orchestrator: <HugeiconsIcon icon={CompassData} size={14} />,
  contract_reviewer: <HugeiconsIcon icon={Scroll01Data} size={14} />,
  content_compliance: <HugeiconsIcon icon={Shield01Data} size={14} />,
  distribution_manager: <HugeiconsIcon icon={Satellite01Data} size={14} />,
  report_generator: <HugeiconsIcon icon={Analytics01Data} size={14} />,
  revenue_optimizer: <HugeiconsIcon icon={Cash02Data} size={14} />,
  brand_safety: <HugeiconsIcon icon={Shield01Data} size={14} />,
  content_calendar: <HugeiconsIcon icon={Calendar03Data} size={14} />,
  threat_sentinel: <HugeiconsIcon icon={LockedData} size={14} />,
  audience_analyst: <HugeiconsIcon icon={UserGroup03Data} size={14} />,
  trend_radar: <HugeiconsIcon icon={AiSearch01Data} size={14} />,
  hook_architect: <HugeiconsIcon icon={PencilEdit01Data} size={14} />,
  clipping_director: <HugeiconsIcon icon={ScissorsData} size={14} />,
  video_cinematographer: <HugeiconsIcon icon={VideoAiData} size={14} />,
  thumbnail_director: <HugeiconsIcon icon={ViewData} size={14} />,
  community_guardian: <HugeiconsIcon icon={Comment01Data} size={14} />,
}

// ─── Memory bank / section icons ─────────────────────────
export const SECTION_ICONS: Record<string, ReactNode> = {
  building: <HugeiconsIcon icon={Building05Data} size={20} />,
  store: <HugeiconsIcon icon={Store04Data} size={20} />,
  star: <HugeiconsIcon icon={StarData} size={20} />,
  trending: <HugeiconsIcon icon={AutoConversationsData} size={20} />,
  calendar: <HugeiconsIcon icon={Calendar03Data} size={20} />,
  video: <HugeiconsIcon icon={VideoAiData} size={20} />,
}

// ─── Action button icons ─────────────────────────────────
export const ACTION_ICONS = {
  file: <HugeiconsIcon icon={File01Data} size={18} />,
  edit: <HugeiconsIcon icon={Edit03Data} size={18} />,
  download: <HugeiconsIcon icon={DownloadSquare01Data} size={18} />,
  upload: <HugeiconsIcon icon={UploadSquare01Data} size={18} />,
  video: <HugeiconsIcon icon={VideoAiData} size={18} />,
  sparkle: <SparkleIcon size={18} />,
  calendar: <HugeiconsIcon icon={Calendar03Data} size={18} />,
  play: <HugeiconsIcon icon={PlayData} size={18} />,
  pause: <HugeiconsIcon icon={PauseData} size={18} />,
  chevronRight: <CaretLineRightIcon size={18} />,
  check: <HugeiconsIcon icon={CheckmarkSquare03Data} size={18} />,
  alert: <HugeiconsIcon icon={Alert02Data} size={18} />,
} as const

// ─── Trend arrows ────────────────────────────────────────
export const TrendUpIcon = TrendingUp
export const TrendDownIcon = TrendingDown

// ─── Landing page feature icons ──────────────────────────
export const FEATURE_ICONS = {
  rocket: makeIcon(Rocket01Data, 28),
  lock: makeIcon(LockedData, 28),
  zap: makeIcon(ZapData, 28),
  eye: makeIcon(ViewData, 28),
  layers: makeIcon(LayersLogoData, 28),
  globe: makeIcon(GlobeData, 28),
  shield: makeIcon(Shield01Data, 28),
  brain: makeIcon(AiBrain01Data, 28),
  bot: makeIcon(BotData, 28),
} as const

// ─── Reexport Phosphor icons for direct use ──────────────
export { XIcon, XCircleIcon, CaretLineRightIcon, SparkleIcon, ChartBarIcon }

// ─── Reexport raw icon data for components that need it ──
export {
  PlayData as PlayIconData,
  PauseData as PauseIconData,
  Mic01Data as Mic01IconData,
  CheckmarkSquare03Data,
  Alert02Data,
}
