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
export const InstagramIcon = g('photo_camera', 18);
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