import axios from 'axios';
import { ENV } from '../config/env';

const API_URL = ENV.API_URL;

// Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  subscription: string;
  subscriptionExpires?: Date;
  isSuspended?: boolean;
  suspensionReason?: string;
  lastLogin?: Date;
  createdAt: Date;
}

export interface PaginatedUsers {
  users: AdminUser[];
  pagination: {
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface AuditLogEntry {
  id: string;
  action: string;
  timestamp: Date;
  performedBy: {
    id: string;
    name: string;
    email: string;
  };
  targetUser?: {
    id: string;
    name: string;
    email: string;
  };
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface PaginatedAuditLogs {
  auditLogs: AuditLogEntry[];
  pagination: {
    totalLogs: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

interface UserDetailsResponse {
  success: boolean;
  user: AdminUser;
  loginHistory: AuditLogEntry[];
  recentActivity: AuditLogEntry[];
}

interface SuccessResponse {
  success: boolean;
  message: string;
}

interface UpdateUserResponse {
  success: boolean;
  message: string;
  user: AdminUser;
}

interface ImpersonateResponse extends SuccessResponse {
  impersonationToken: string;
}

interface UserDataExportResponse {
  success: boolean;
  userData: any;
}

interface BulkActionResponse extends SuccessResponse {
  results: Array<{
    userId: string;
    success: boolean;
    message: string;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

interface DashboardStats {
  totalUsers: number;
  premiumUsers: number;
  activeBooks: number;
}

interface DashboardStatsResponse {
  success: boolean;
  stats: DashboardStats;
}

// User Management
export const getUsers = async (
  page = 1, 
  limit = 10, 
  search = '', 
  role = '', 
  status = '', 
  sortField = 'createdAt', 
  sortOrder = 'desc'
): Promise<PaginatedUsers> => {
  const response = await axios.get(`${API_URL}/api/admin/users`, {
    params: { page, limit, search, role, status, sortField, sortOrder },
    withCredentials: true
  });
  return response.data as PaginatedUsers;
};

export const getUserDetails = async (userId: string): Promise<UserDetailsResponse> => {
  const response = await axios.get(`${API_URL}/api/admin/users/${userId}`, {
    withCredentials: true
  });
  return response.data as UserDetailsResponse;
};

export const updateUserInfo = async (userId: string, userData: Partial<AdminUser>): Promise<UpdateUserResponse> => {
  const response = await axios.put(`${API_URL}/api/admin/users/${userId}`, userData, {
    withCredentials: true
  });
  return response.data as UpdateUserResponse;
};

export const resetUserPassword = async (userId: string): Promise<SuccessResponse> => {
  const response = await axios.post(`${API_URL}/api/admin/users/${userId}/reset-password`, {}, {
    withCredentials: true
  });
  return response.data as SuccessResponse;
};

export const impersonateUser = async (userId: string): Promise<ImpersonateResponse> => {
  const response = await axios.post(`${API_URL}/api/admin/users/${userId}/impersonate`, {}, {
    withCredentials: true
  });
  return response.data as ImpersonateResponse;
};

export const exportUserData = async (userId: string): Promise<UserDataExportResponse> => {
  const response = await axios.get(`${API_URL}/api/admin/users/${userId}/export`, {
    withCredentials: true
  });
  return response.data as UserDataExportResponse;
};

export const suspendUser = async (userId: string, reason?: string): Promise<SuccessResponse> => {
  const response = await axios.post(`${API_URL}/api/admin/users/${userId}/suspend`, { reason }, {
    withCredentials: true
  });
  return response.data as SuccessResponse;
};

export const unsuspendUser = async (userId: string): Promise<SuccessResponse> => {
  const response = await axios.post(`${API_URL}/api/admin/users/${userId}/unsuspend`, {}, {
    withCredentials: true
  });
  return response.data as SuccessResponse;
};

export const changeUserRole = async (userId: string, role: string): Promise<SuccessResponse> => {
  const response = await axios.post(`${API_URL}/api/admin/users/${userId}/change-role`, { role }, {
    withCredentials: true
  });
  return response.data as SuccessResponse;
};

export const deleteUser = async (userId: string): Promise<SuccessResponse> => {
  const response = await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
    withCredentials: true
  });
  return response.data as SuccessResponse;
};

export const sendNotification = async (userId: string, subject: string, message: string, sendEmail: boolean = false): Promise<SuccessResponse> => {
  const response = await axios.post(`${API_URL}/api/admin/users/${userId}/notify`, { subject, message, sendEmail }, {
    withCredentials: true
  });
  return response.data as SuccessResponse;
};

// Bulk Actions
export const bulkUserAction = async (userIds: string[], action: string, reason?: string, role?: string): Promise<BulkActionResponse> => {
  const payload: any = { userIds, action };
  if (reason) payload.reason = reason;
  if (role) payload.role = role;
  
  const response = await axios.post(`${API_URL}/api/admin/users/bulk-action`, payload, {
    withCredentials: true
  });
  return response.data as BulkActionResponse;
};

// Audit Logs
export const getAuditLogs = async (
  page = 1, 
  limit = 20, 
  action = '',
  userId = '',
  startDate?: Date,
  endDate?: Date,
  sortField = 'timestamp',
  sortOrder = 'desc'
): Promise<PaginatedAuditLogs> => {
  const params: any = { page, limit, sortField, sortOrder };
  if (action) params.action = action;
  if (userId) params.userId = userId;
  if (startDate) params.startDate = startDate.toISOString();
  if (endDate) params.endDate = endDate.toISOString();
  
  const response = await axios.get(`${API_URL}/api/admin/audit-logs`, {
    params,
    withCredentials: true
  });
  return response.data as PaginatedAuditLogs;
};

// Dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await axios.get(`${API_URL}/api/admin/dashboard-stats`, {
    withCredentials: true
  });
  return response.data as DashboardStatsResponse;
}; 

// Title Changes
export interface TitleChangeItem {
  _id: string;
  userId: string;
  projectId: string;
  oldTitle: string;
  newTitle: string;
  similarityDelta: number; // 0-100
  triggerReason: string;
  status: 'Pending' | 'Approved' | 'Denied' | 'Cancelled';
  requestedAt: string;
}

export const listTitleChanges = async (params: { status?: string; userId?: string; projectId?: string; from?: string; to?: string } = {}) => {
  const res = await axios.get(`${API_URL}/api/admin/title-changes`, { params, withCredentials: true });
  return res.data as { success: boolean; items: TitleChangeItem[] };
};

export const approveTitleChange = async (id: string) => {
  const res = await axios.post(`${API_URL}/api/admin/title-changes/${id}/approve`, {}, { withCredentials: true });
  return res.data as { success: boolean };
};

export const denyTitleChange = async (id: string, reason?: string) => {
  const res = await axios.post(`${API_URL}/api/admin/title-changes/${id}/deny`, { reason }, { withCredentials: true });
  return res.data as { success: boolean };
};