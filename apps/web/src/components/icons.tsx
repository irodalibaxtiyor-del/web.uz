import {
  IconAlertCircle,
  IconAlertTriangle,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconAward,
  IconBan,
  IconBook2,
  IconBriefcase,
  IconChartBar,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCircle,
  IconCircleCheck,
  IconCircleDashed,
  IconCircleHalf2,
  IconCircleX,
  IconClock,
  IconCode,
  IconCopy,
  IconExternalLink,
  IconHelpCircle,
  IconHome,
  IconInfoCircle,
  IconLayoutDashboard,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLoader2,
  IconLock,
  IconLogout,
  IconMaximize,
  IconMenu2,
  IconMessageCircle,
  IconMinimize,
  IconPencil,
  IconPlayerPlay,
  IconPlus,
  IconSchool,
  IconSearch,
  IconSelector,
  IconSend,
  IconSettings,
  IconStar,
  IconThumbDown,
  IconThumbUp,
  IconTrash,
  IconTrophy,
  IconUpload,
  IconUser,
  IconUsers,
  IconX,
  type Icon as TablerIcon,
} from '@tabler/icons-react';
import type { SVGProps } from 'react';

/**
 * The single icon set of the app (Tabler, outline). Every icon renders with the same stroke
 * width; size comes from `className` (`size-4`, `size-5`, ...). Icons are decorative by
 * default — the text next to them carries the meaning.
 */
const ICONS = {
  alert: IconAlertTriangle,
  alertCircle: IconAlertCircle,
  arrowDown: IconArrowDown,
  arrowLeft: IconArrowLeft,
  arrowRight: IconArrowRight,
  arrowUp: IconArrowUp,
  award: IconAward,
  ban: IconBan,
  book: IconBook2,
  briefcase: IconBriefcase,
  chart: IconChartBar,
  check: IconCheck,
  checkCircle: IconCircleCheck,
  chevronDown: IconChevronDown,
  chevronLeft: IconChevronLeft,
  chevronRight: IconChevronRight,
  chevronUp: IconChevronUp,
  circle: IconCircle,
  circleDashed: IconCircleDashed,
  circleHalf: IconCircleHalf2,
  circleX: IconCircleX,
  clock: IconClock,
  code: IconCode,
  copy: IconCopy,
  external: IconExternalLink,
  help: IconHelpCircle,
  home: IconHome,
  info: IconInfoCircle,
  dashboard: IconLayoutDashboard,
  loader: IconLoader2,
  lock: IconLock,
  logout: IconLogout,
  maximize: IconMaximize,
  menu: IconMenu2,
  message: IconMessageCircle,
  minimize: IconMinimize,
  pencil: IconPencil,
  play: IconPlayerPlay,
  plus: IconPlus,
  school: IconSchool,
  search: IconSearch,
  selector: IconSelector,
  send: IconSend,
  settings: IconSettings,
  sidebarCollapse: IconLayoutSidebarLeftCollapse,
  sidebarExpand: IconLayoutSidebarLeftExpand,
  star: IconStar,
  thumbDown: IconThumbDown,
  thumbUp: IconThumbUp,
  trash: IconTrash,
  trophy: IconTrophy,
  upload: IconUpload,
  user: IconUser,
  users: IconUsers,
  x: IconX,
} satisfies Record<string, TablerIcon>;

export type IconName = keyof typeof ICONS;

export const ICON_STROKE = 1.75;

export function Icon({
  name,
  className = 'size-5',
  ...props
}: { name: IconName } & Omit<SVGProps<SVGSVGElement>, 'ref' | 'stroke'>) {
  const Component = ICONS[name];
  return (
    <Component
      aria-hidden="true"
      focusable="false"
      stroke={ICON_STROKE}
      className={`shrink-0 ${className}`}
      {...props}
    />
  );
}
