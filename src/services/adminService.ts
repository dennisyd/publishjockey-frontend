import { http } from './http';



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
  const response = await http.get(`/admin/users`, {
    params: { page, limit, search, role, status, sortField, sortOrder }
  });
  return response.data as PaginatedUsers;
};

export const getUserDetails = async (userId: string): Promise<UserDetailsResponse> => {
  const response = await http.get(`/admin/users/${userId}`);
  return response.data as UserDetailsResponse;
};

export const updateUserInfo = async (userId: string, userData: Partial<AdminUser>): Promise<UpdateUserResponse> => {
  const response = await http.put(`/admin/users/${userId}`, userData);
  return response.data as UpdateUserResponse;
};

export const resetUserPassword = async (userId: string): Promise<SuccessResponse> => {
  const response = await http.post(`/admin/users/${userId}/reset-password`, {});
  return response.data as SuccessResponse;
};

export const impersonateUser = async (userId: string): Promise<ImpersonateResponse> => {
  const response = await http.post(`/admin/users/${userId}/impersonate`, {});
  return response.data as ImpersonateResponse;
};

export const exportUserData = async (userId: string): Promise<UserDataExportResponse> => {
  const response = await http.get(`/admin/users/${userId}/export`);
  return response.data as UserDataExportResponse;
};

export const suspendUser = async (userId: string, reason?: string): Promise<SuccessResponse> => {
  const response = await http.post(`/admin/users/${userId}/suspend`, { reason });
  return response.data as SuccessResponse;
};

export const unsuspendUser = async (userId: string): Promise<SuccessResponse> => {
  const response = await http.post(`/admin/users/${userId}/unsuspend`, {});
  return response.data as SuccessResponse;
};

export const changeUserRole = async (userId: string, role: string): Promise<SuccessResponse> => {
  const response = await http.post(`/admin/users/${userId}/change-role`, { role });
  return response.data as SuccessResponse;
};

export const deleteUser = async (userId: string): Promise<SuccessResponse> => {
  const response = await http.delete(`/admin/users/${userId}`);
  return response.data as SuccessResponse;
};

// New functions for book management
export const getUserBooks = async (userId: string): Promise<{
  success: boolean;
  books: Array<{
    _id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
  }>;
  user: {
    id: string;
    name: string;
    email: string;
  };
}> => {
  const response = await http.get(`/admin/users/${userId}/books`);
  return response.data;
};

export const deleteBook = async (userId: string, bookId: string): Promise<{
  success: boolean;
  message: string;
  deletionReport: {
    bookDeleted: boolean;
    imagesDeleted: number;
    errors: string[];
  };
}> => {
  const response = await http.delete(`/admin/users/${userId}/books/${bookId}`);
  return response.data;
};

// Enhanced delete user function with deletion report
export const deleteUserWithReport = async (userId: string): Promise<{
  success: boolean;
  message: string;
  deletionReport: {
    booksDeleted: number;
    imagesDeleted: number;
    userDeleted: boolean;
    errors: string[];
  };
}> => {
  const response = await http.delete(`/admin/users/${userId}`);
  return response.data;
};

export const sendNotification = async (userId: string, subject: string, message: string, sendEmail: boolean = false): Promise<SuccessResponse> => {
  const response = await http.post(`/admin/users/${userId}/notify`, { subject, message, sendEmail });
  return response.data as SuccessResponse;
};

// Bulk Actions
export const bulkUserAction = async (userIds: string[], action: string, reason?: string, role?: string): Promise<BulkActionResponse> => {
  const payload: any = { userIds, action };
  if (reason) payload.reason = reason;
  if (role) payload.role = role;
  
  const response = await http.post(`/admin/users/bulk-action`, payload);
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
  
  const response = await http.get(`/admin/audit-logs`, {
    params
  });
  return response.data as PaginatedAuditLogs;
};

// Dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await http.get(`/admin/dashboard-stats`);
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
  const res = await http.get(`/admin/title-changes`, { params });
  return res.data as { success: boolean; items: TitleChangeItem[] };
};

export const approveTitleChange = async (id: string) => {
  const res = await http.post(`/admin/title-changes/${id}/approve`, {});
  return res.data as { success: boolean };
};

export const denyTitleChange = async (id: string, reason?: string) => {
  const res = await http.post(`/admin/title-changes/${id}/deny`, { reason });
  return res.data as { success: boolean };
};