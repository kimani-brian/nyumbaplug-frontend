import { Icon } from '../components/ui/Icon';

/**
 * Shared Material Symbols icon helpers (Google).
 * Centralizes the lucide -> Material Symbols mapping so components import
 * readable, semantic helpers instead of magic ligature strings.
 */

interface GlyphProps {
  size?: number;
  filled?: boolean;
  className?: string;
}

const g =
  (name: string, defaultSize = 18) =>
  ({ size, filled, className }: GlyphProps) => (
    <Icon name={name} size={size ?? defaultSize} filled={filled} className={className} />
  );

export const ArrowForward = g('arrow_forward');
export const ArrowBack = g('arrow_back');
export const ArrowRight = g('arrow_forward', 12);
export const MenuIcon = g('menu', 22);
export const CloseIcon = g('close', 20);
export const SearchIcon = g('search', 18);
export const SunIcon = g('light_mode', 20);
export const MoonIcon = g('dark_mode', 20);
export const InboxIcon = g('inbox', 48);
export const MapPinIcon = g('location_on', 16);
export const PhoneIcon = g('call', 18);
export const MessageIcon = g('chat_bubble', 18);
export const SendIcon = g('send', 16);
export const ShieldIcon = g('verified_user', 18,);
export const ShieldCheckIcon = g('verified', 18);
export const ShieldAlertIcon = g('gpp_bad', 18);
export const ShieldXIcon = g('gpp_maybe', 18);
export const CheckCircleIcon = g('check_circle', 18,);
export const XCircleIcon = g('cancel', 18);
export const AlertTriangleIcon = g('warning', 18);
export const AlertOctagonIcon = g('report', 18);
export const ClockIcon = g('schedule', 18);
export const CalendarIcon = g('calendar_month', 18);
export const MailIcon = g('mail', 18);
export const LockIcon = g('lock', 18);
export const HomeIcon = g('home', 18);
export const BuildingIcon = g('apartment', 18);
export const Building2Icon = g('domain', 18);
export const UserIcon = g('person', 18);
export const UsersIcon = g('group', 18);
export const EyeIcon = g('visibility', 18);
export const EyeOffIcon = g('visibility_off', 18);
export const EditIcon = g('edit', 18);
export const TrashIcon = g('delete', 18);
export const PlusIcon = g('add', 18);
export const MinusIcon = g('remove', 18);
export const RefreshIcon = g('refresh', 18);
export const UploadIcon = g('upload', 18);
export const ImageIcon = g('image', 18);
export const PlayIcon = g('play_circle', 18);
export const ChevronLeftIcon = g('chevron_left', 20);
export const ChevronRightIcon = g('chevron_right', 20);
export const ChevronDownIcon = g('expand_more', 18);
export const ChevronUpIcon = g('expand_less', 18);
export const ExternalLinkIcon = g('open_in_new', 18);
export const FileTextIcon = g('description', 18);
export const QuoteIcon = g('format_quote', 20);
export const StarIcon = g('star', 14);
export const PhotoLibraryIcon = g('photo_library', 18);
export const RestartAltIcon = g('restart_alt', 16);

// Re-export the base component for components that need a raw/generic icon.
export const HistoryIcon = g('history', 18);
export const FlagIcon = g('flag', 18);
export const FileCheckIcon = g('fact_check', 18);
export const TrendingUpIcon = g('trending_up', 18);
export const BoxesIcon = g('inventory_2', 18);
export const DashboardIcon = g('dashboard', 18);
export const LogoutIcon = g('logout', 18);
export const LoaderIcon = g('progress_activity', 18);
export const KeyIcon = g('key', 18);
export const FilterIcon = g('filter_list', 18);
export const ClearIcon = g('clear', 18);
// Instagram is a brand glyph, so it's a real SVG (Material Symbols has no
// official brand mark — the old `photo_camera` mapping rendered a plain camera).
export const InstagramIcon = ({ size = 18, className }: GlyphProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 448 512"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
  </svg>
);
export const WhatsAppIcon = g('forum', 18);
export const LanguageIcon = g('language', 18);
export const CredentialIcon = g('badge', 18);
export const PersonOffIcon = g('person_off', 18);
export const VerifiedIcon = g('verified', 18);
export const SecurityIcon = g('security', 18);
export const CheckIcon = g('check', 18);
export const CallIncomingIcon = g('phone_callback', 18);
export const LinkIcon = g('link', 18);

// Re-export the base component for components that need a raw/generic icon.
export { Icon };
export default Icon;