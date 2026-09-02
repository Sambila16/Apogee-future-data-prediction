const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export type AuthUser = {
  id: number;
  email: string;
  full_name: string;
  company?: string | null;
  created_at: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

export type ModelItem = {
  id: number;
  name: string;
  model_type: string;
  origin: string;
  status: string;
  target_metric?: string | null;
  description?: string | null;
  accuracy?: number | null;
  runs_count: number;
  workspace_id?: number | null;
  data_source_id?: number | null;
  created_at: string;
  updated_at: string;
};

export type PrebuiltModel = {
  key: string;
  name: string;
  model_type: string;
  description: string;
  target_metric: string;
};

export type WorkspaceItem = {
  id: number;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
  models_count: number;
};

export type DataSourceItem = {
  id: number;
  name: string;
  source_type: string;
  status: string;
  last_sync_at?: string | null;
  created_at: string;
};

export type DataRecordItem = {
  id: number;
  ts: string;
  value: number;
};

export type RecordUploadResult = {
  rows_imported: number;
  rows_skipped: number;
};

export type TeamMemberItem = {
  id: number;
  role: string;
  status: string;
  user: AuthUser;
};

export type DashboardStats = {
  models_count: number;
  active_models: number;
  data_sources_count: number;
  workspaces_count: number;
  team_count: number;
};

export function getToken(): string | null {
  return localStorage.getItem('apogee_token');
}

export function setAuth(token: string, user: AuthUser) {
  localStorage.setItem('apogee_token', token);
  localStorage.setItem('apogee_user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('apogee_token');
  localStorage.removeItem('apogee_user');
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem('apogee_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = (data as { detail?: string | { msg: string }[] }).detail;
    let message = 'Request failed';
    if (typeof detail === 'string') message = detail;
    else if (Array.isArray(detail) && detail[0]?.msg) message = detail[0].msg;
    throw new Error(message);
  }
  return data as T;
}

// Auth
export const login = (email: string, password: string) =>
  request<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const signup = (payload: { email: string; password: string; full_name: string; company?: string }) =>
  request<AuthResponse>('/api/auth/signup', { method: 'POST', body: JSON.stringify(payload) });

export const fetchMe = () => request<AuthUser>('/api/auth/me');

// Models
export const listModels = () => request<ModelItem[]>('/api/models');
export const listPrebuilt = () => request<PrebuiltModel[]>('/api/models/prebuilt');
export const createModel = (payload: {
  name: string;
  model_type: string;
  origin?: string;
  target_metric?: string;
  description?: string;
  workspace_id?: number;
  data_source_id?: number;
  template_key?: string;
}) => request<ModelItem>('/api/models', { method: 'POST', body: JSON.stringify(payload) });

export const runModel = (id: number) =>
  request<{
    id: number;
    status: string;
    accuracy?: number | null;
    mae?: number | null;
    mape?: number | null;
    is_simulated: boolean;
    training_points?: number | null;
    result_summary?: string;
  }>(`/api/models/${id}/run`, {
    method: 'POST',
  });

export const deleteModel = (id: number) => request<void>(`/api/models/${id}`, { method: 'DELETE' });

// Workspaces
export const listWorkspaces = () => request<WorkspaceItem[]>('/api/workspaces');
export const createWorkspace = (payload: { name: string; description?: string }) =>
  request<WorkspaceItem>('/api/workspaces', { method: 'POST', body: JSON.stringify(payload) });

// Data sources
export const listDataSources = () => request<DataSourceItem[]>('/api/data-sources');
export const createDataSource = (payload: { name: string; source_type: string }) =>
  request<DataSourceItem>('/api/data-sources', { method: 'POST', body: JSON.stringify(payload) });

export const listDataRecords = (sourceId: number) =>
  request<DataRecordItem[]>(`/api/data-sources/${sourceId}/records`);

export async function uploadDataRecords(sourceId: number, file: File): Promise<RecordUploadResult> {
  const token = getToken();
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/api/data-sources/${sourceId}/records/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = (data as { detail?: string }).detail;
    throw new Error(detail || 'Upload failed');
  }
  return data as RecordUploadResult;
}

// Team & dashboard
export const listTeam = () => request<TeamMemberItem[]>('/api/team');
export const fetchDashboard = () => request<DashboardStats>('/api/dashboard');

// Model run history
export type ModelRunItem = {
  id: number;
  model_id: number;
  status: string;
  accuracy?: number | null;
  mae?: number | null;
  mape?: number | null;
  is_simulated: boolean;
  training_points?: number | null;
  result_summary?: string;
  created_at: string;
};
export const listModelRuns = (modelId: number) => request<ModelRunItem[]>(`/api/models/${modelId}/runs`);

// Profile & organization
export type MeResponse = {
  user: AuthUser;
  organization: { id: number; name: string; plan: string };
  role: string;
};
export const getMe = () => request<MeResponse>('/api/me');
export const updateMe = (payload: { full_name?: string; company?: string }) =>
  request<AuthUser>('/api/me', { method: 'PUT', body: JSON.stringify(payload) });
export const updateOrganization = (payload: { name: string }) =>
  request<{ id: number; name: string; plan: string }>('/api/organization', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

// Billing
export type SubscriptionInfo = {
  plan: string;
  status: string;
  amount: number;
  currency: string;
  renews_at?: string | null;
};
export type InvoiceItem = {
  id: number;
  amount: number;
  status: string;
  invoice_date: string;
};
export const getSubscription = () => request<SubscriptionInfo | null>('/api/billing/subscription');
export const listInvoices = () => request<InvoiceItem[]>('/api/billing/invoices');

// Analytics
export type RevenueSeriesPoint = { date: string; actual?: number | null; predicted?: number | null };
export type ModelPerformanceItem = {
  id: number;
  name: string;
  accuracy?: number | null;
  is_simulated: boolean;
  status: string;
};
export type AnalyticsData = {
  has_real_forecast: boolean;
  revenue_series: RevenueSeriesPoint[];
  model_performance: ModelPerformanceItem[];
};
export const getAnalytics = () => request<AnalyticsData>('/api/analytics');
