import { Property, LandlordProfile, UnitCategory, PropertyReport, AdminAuditLog, ContactInfoResponse, User, CustomerView, CustomerProfile, TenantProfile, PropertyManagerView, PropertyManagerDetail, CallRequestView, MessageView } from '../types';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1';

let token: string | null = null;

export function setAuthToken(t: string | null) {
  token = t;
}

export function getAuthToken(): string | null {
  return token;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    // Try to parse error body, fall back to statusText
    const errBody = await res.json().catch(() => null) as any;
    const message = errBody?.error || errBody?.message || res.statusText || 'Request failed';
    const e: any = new Error(message);
    e.status = res.status;
    e.body = errBody;
    throw e;
  }

  // Handle empty responses
  const text = await res.text();
  return text ? JSON.parse(text) as T : (undefined as unknown as T);
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Upload failed');
  }
  const data = await res.json();
  return data.url;
}

class ApiService {

  // Auth
  async login(identifier: string, password: string): Promise<{ token: string; user: User }> {
    const res = await request<{ token: string; user: User }>('POST', '/auth/login', { identifier, password });
    setAuthToken(res.token);
    return res;
  }

  async register(data: { email: string; password: string; role: string; full_name?: string; page_name?: string }): Promise<{ email: string; message: string }> {
    const body: Record<string, unknown> = {
      email: data.email,
      password: data.password,
      role: data.role,
    };
    if (data.full_name) body.full_name = data.full_name;
    if (data.page_name) body.page_name = data.page_name;
    const res = await request<{ email: string; message: string }>('POST', '/auth/register', body);
    return res;
  }

  async verifyEmail(email: string, code: string): Promise<{ token: string; user: User }> {
    const res = await request<{ token: string; user: User }>('POST', '/auth/verify-email', { email, code });
    setAuthToken(res.token);
    return res;
  }

  async resendOtp(email: string): Promise<void> {
    await request<{ message: string }>('POST', '/auth/resend-otp', { email });
  }

  // Public browse
  async getProperties(params?: {
    q?: string;
    county?: string;
    min_rent?: number;
    max_rent?: number;
  }): Promise<Property[]> {
    const qp = new URLSearchParams();
    if (params?.q) qp.set('q', params.q);
    if (params?.county) qp.set('county', params.county);
    if (params?.min_rent) qp.set('min_rent', String(params.min_rent));
    if (params?.max_rent) qp.set('max_rent', String(params.max_rent));
    const qs = qp.toString();
    const res = await request<Property[] | null>('GET', `/properties${qs ? '?' + qs : ''}`);
    return res ?? [];
  }

  async getPropertyDetail(id: string): Promise<{ property: Property; categories: UnitCategory[] }> {
    return request<{ property: Property; categories: UnitCategory[] }>('GET', `/properties/${id}`);
  }

  async getUnitContact(categoryId: string): Promise<ContactInfoResponse> {
    return request<ContactInfoResponse>('GET', `/categories/${categoryId}/contact`);
  }

  async requestCallBack(propertyId: string, data: { unit_category_id?: string; tenant_name: string; tenant_phone: string }): Promise<{ message: string }> {
    return request<{ message: string }>('POST', `/properties/${propertyId}/call-requests`, data);
  }

  async getCallRequests(): Promise<CallRequestView[]> {
    const res = await request<CallRequestView[] | null>('GET', '/landlord/call-requests');
    return res ?? [];
  }

  async markCallRequestContacted(requestId: string): Promise<{ message: string }> {
    return request<{ message: string }>('POST', `/landlord/call-requests/${requestId}/contacted`, {});
  }

  async getMessages(): Promise<MessageView[]> {
    const res = await request<MessageView[] | null>('GET', '/landlord/messages');
    return res ?? [];
  }

  async markMessageRead(messageId: string): Promise<{ message: string }> {
    return request<{ message: string }>('POST', `/landlord/messages/${messageId}/read`, {});
  }

  async sendMessage(unitId: string, data: { tenant_name: string; tenant_phone: string; message: string }): Promise<{ message: string }> {
    return request<{ message: string }>(`POST`, `/categories/${unitId}/messages`, data);
  }

  // Landlord
  async getMyLandlordProfile(): Promise<LandlordProfile | null> {
    const res = await request<LandlordProfile | { profile: null }>('GET', '/landlord/me');
    if (res === null || (res as any).profile === null) return null;
    return res as LandlordProfile;
  }

  async updateMyProfile(data: {
    full_name?: string;
    page_name?: string;
    phone?: string;
    id_document_url?: string;
  }): Promise<LandlordProfile> {
    return request<LandlordProfile>('PUT', '/landlord/profile', data);
  }

  async submitVerificationRequest(data: { full_name: string; page_name?: string; phone?: string; national_id_number: string; id_document_url?: string }): Promise<LandlordProfile> {
    return request<LandlordProfile>('POST', '/landlord/profile', data);
  }

  async getLandlordProperties(): Promise<Property[]> {
    const res = await request<Property[] | null>('GET', '/landlord/properties');
    return res ?? [];
  }

  async addProperty(data: {
    name: string;
    location: string;
    county?: string;
    address?: string;
    maps_url?: string;
    description?: string;
    image_url?: string;
  }): Promise<Property> {
    return request<Property>('POST', '/landlord/properties', data);
  }

  async updateProperty(propertyId: string, data: {
    name?: string;
    location?: string;
    county?: string;
    address?: string;
    maps_url?: string;
    description?: string;
    image_url?: string;
  }): Promise<Property> {
    return request<Property>('PATCH', `/landlord/properties/${propertyId}`, data);
  }

  async deleteProperty(propertyId: string): Promise<{ message: string }> {
    return request<{ message: string }>('DELETE', `/landlord/properties/${propertyId}`);
  }

  async addCategory(propertyId: string, data: {
    name: string;
    description?: string;
    rent_amount: number;
    quantity_available: number;
    photos?: string[];
    video_url?: string;
  }): Promise<UnitCategory> {
    return request<UnitCategory>('POST', `/landlord/properties/${propertyId}/categories`, data);
  }

  async updateCategory(categoryId: string, data: {
    name?: string;
    description?: string;
    rent_amount?: number;
    quantity_available?: number;
    photos?: string[];
    video_url?: string;
  }): Promise<UnitCategory> {
    return request<UnitCategory>('PATCH', `/landlord/categories/${categoryId}`, data);
  }

  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    return request<{ message: string }>('DELETE', `/landlord/categories/${categoryId}`);
  }

  async adjustQuantity(categoryId: string, delta: number): Promise<{ message: string }> {
    return request<{ message: string }>('POST', `/landlord/categories/${categoryId}/quantity`, { delta });
  }

  // Admin
  async getPendingVerifications(): Promise<LandlordProfile[]> {
    const res = await request<LandlordProfile[] | null>('GET', '/admin/verifications?status=pending');
    return res ?? [];
  }

  async getVerifications(status: string): Promise<LandlordProfile[]> {
    const res = await request<LandlordProfile[] | null>('GET', `/admin/verifications?status=${status}`);
    return res ?? [];
  }

  async approveLandlord(landlordId: string): Promise<{ message: string }> {
    return request<{ message: string }>('POST', `/admin/verifications/${landlordId}/approve`);
  }

  async revokeLandlord(landlordId: string, reason: string): Promise<{ message: string }> {
    return request<{ message: string }>('POST', `/admin/verifications/${landlordId}/revoke`, { reason });
  }

  async getReports(): Promise<PropertyReport[]> {
    const res = await request<PropertyReport[] | null>('GET', '/admin/reports');
    return res ?? [];
  }

  async resolveReport(reportId: string): Promise<{ message: string }> {
    return request<{ message: string }>('POST', `/admin/reports/${reportId}/resolve`);
  }

  async getAuditLogs(): Promise<AdminAuditLog[]> {
    const res = await request<AdminAuditLog[] | null>('GET', '/admin/audit-log');
    return res ?? [];
  }

  async getCustomers(): Promise<CustomerView[]> {
    const res = await request<CustomerView[] | null>('GET', '/admin/customers');
    return res ?? [];
  }

  async getAllPropertyManagers(): Promise<PropertyManagerView[]> {
    const res = await request<PropertyManagerView[] | null>('GET', '/admin/property-managers');
    return res ?? [];
  }

  async getPropertyManagerProperties(landlordProfileId: string): Promise<Property[]> {
    const res = await request<Property[] | null>('GET', `/admin/property-managers/${landlordProfileId}/properties`);
    return res ?? [];
  }

  async getPropertyManagerProfile(landlordProfileId: string): Promise<PropertyManagerDetail> {
    return request<PropertyManagerDetail>('GET', `/admin/property-managers/${landlordProfileId}/profile`);
  }

  async getCustomerProfile(userId: string): Promise<CustomerProfile> {
    return request<CustomerProfile>('GET', `/admin/customers/${userId}/profile`);
  }

  // Customer (tenant) profile
  async getMyCustomerProfile(): Promise<TenantProfile | null> {
    const res = await request<TenantProfile | { profile: null }>('GET', '/tenant/me');
    if (res === null || (res as any).profile === null) return null;
    return res as TenantProfile;
  }

  async updateMyCustomerProfile(data: {
    full_name?: string;
    phone?: string;
    location?: string;
  }): Promise<TenantProfile> {
    return request<TenantProfile>('PUT', '/tenant/profile', data);
  }

  // Reports
  async createReport(propertyId: string, reason: string, details?: string): Promise<{ message: string }> {
    return request<{ message: string }>('POST', `/properties/${propertyId}/report`, { reason, details });
  }
}

export const api = new ApiService();
export { uploadFile };
