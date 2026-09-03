export type UserRole = 'admin' | 'landlord' | 'tenant';
export type VerificationStatus = 'pending' | 'verified' | 'revoked';
export type UnitStatus = 'vacant' | 'occupied' | 'reserved' | 'maintenance';

export interface User {
  id: string;
  role: UserRole;
  email?: string;
  phone?: string;
  email_verified?: boolean;
  created_at: string;
}

export interface LandlordProfile {
  id: string;
  user_id: string;
  national_id_number: string;
  page_name?: string;
  id_document_url?: string;
  is_caretaker: boolean;
  authorized_by_landlord_id?: string;
  authorizer_name?: string;
  verification_status: VerificationStatus;
  verified_by?: string;
  verified_at?: string;
  revoked_at?: string;
  revoke_reason?: string;
  created_at: string;
  full_name?: string;
}

export interface CustomerView {
  id: string;
  email?: string;
  phone?: string;
  full_name: string;
  location?: string;
  created_at: string;
}

export interface TenantProfile {
  id: string;
  user_id: string;
  full_name: string;
  location?: string;
  created_at: string;
}

export interface CustomerProfile extends CustomerView {
  profile: TenantProfile;
}

export interface PropertyManagerView {
  id: string;
  user_id: string;
  email?: string;
  phone?: string;
  full_name: string;
  page_name?: string;
  national_id_number: string;
  verification_status: VerificationStatus;
  verified_at?: string;
  revoked_at?: string;
  revoke_reason?: string;
  created_at: string;
}

export interface PropertyManagerDetail extends LandlordProfile {
  email?: string;
  phone?: string;
}

export interface Property {
  id: string;
  landlord_id: string;
  name: string;
  location: string;
  county?: string;
  address?: string;
  maps_url?: string;
  description?: string;
  image_url?: string;
  created_at: string;
  landlord?: LandlordProfile;
  categories?: UnitCategory[];
  min_rent?: number;
  total_units?: number;
  map_coords?: string;
  landlord_name?: string;
}

export interface UnitCategory {
  id: string;
  property_id: string;
  name: string;
  description?: string;
  rent_amount: number;
  quantity_available: number;
  photos: string[];
  video_url?: string;
  created_at: string;
}

export interface PropertyReport {
  id: string;
  property_id: string;
  property_name?: string;
  reported_by: string;
  tenant_phone?: string;
  reason: string;
  details?: string;
  resolved: boolean;
  created_at: string;
  landlord_name?: string;
  landlord_id?: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  admin_phone?: string;
  action: 'verify_landlord' | 'revoke_landlord' | 'resolve_report';
  target_type: 'landlord_profile' | 'property_report';
  target_id: string;
  target_name?: string;
  reason?: string;
  created_at: string;
}

export interface ContactInfoResponse {
  unit_id: string;
  property_name: string;
  unit_label: string;
  landlord_phone: string;
  landlord_email?: string;
  landlord_profile: LandlordProfile;
}

export type CallRequestStatus = 'new' | 'contacted';

export interface CallRequest {
  id: string;
  property_id: string;
  unit_category_id?: string;
  tenant_name: string;
  tenant_phone: string;
  status: CallRequestStatus;
  created_at: string;
}

export interface CallRequestView extends CallRequest {
  property_name: string;
  unit_name?: string;
}

export type MessageStatus = 'unread' | 'read' | 'replied';

export interface MessageView {
  id: string;
  property_id: string;
  unit_category_id: string;
  tenant_name: string;
  tenant_phone: string;
  message: string;
  status: MessageStatus;
  created_at: string;
  property_name: string;
  unit_name: string;
}
