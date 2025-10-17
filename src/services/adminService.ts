import api from '../utils/axios';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'operator' | 'admin';
  village?: string;
  address?: string;
  active: boolean;
  joinedAt: string;
  totalBookings?: number;
  totalEquipment?: number;
}

export interface Analytics {
  totalUsers: number;
  totalOperators: number;
  totalEquipment: number;
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  monthlyRevenue: Array<{ month: string; revenue: number; bookings: number }>;
  categoryDistribution: Array<{ category: string; count: number; percentage: number }>;
  topEquipment: Array<{ name: string; bookings: number; revenue: number }>;
  userGrowth: Array<{ month: string; users: number }>;
  popularLocations: Array<{ location: string; bookings: number }>;
}

export interface MaintenanceLog {
  id: number;
  equipmentId: number;
  equipmentName: string;
  maintenanceType: 'routine' | 'repair' | 'inspection';
  description: string;
  cost: number;
  performedBy: string;
  performedDate: string;
  nextMaintenanceDate?: string;
  status: 'completed' | 'pending' | 'in-progress';
}

export interface Report {
  id: number;
  reportType: 'revenue' | 'bookings' | 'equipment' | 'users';
  title: string;
  generatedBy: string;
  generatedAt: string;
  startDate: string;
  endDate: string;
  data: any;
}

export const adminService = {
  // User Management
  getAllUsers: async (role?: string): Promise<User[]> => {
    const response = await api.get('/admin/users', { params: { role } });
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  toggleUserStatus: async (id: number): Promise<User> => {
    const response = await api.patch(`/admin/users/${id}/toggle-status`);
    return response.data;
  },

  // Analytics
  getAnalytics: async (startDate?: string, endDate?: string): Promise<Analytics> => {
    const response = await api.get('/admin/analytics', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getDashboardStats: async (): Promise<Analytics> => {
    const response = await api.get('/admin/analytics/dashboard');
    return response.data;
  },

  // Equipment Management (Admin view)
  getAllEquipmentAdmin: async (): Promise<any[]> => {
    const response = await api.get('/admin/equipment');
    return response.data;
  },

  approveEquipment: async (id: number): Promise<void> => {
    await api.post(`/admin/equipment/${id}/approve`);
  },

  rejectEquipment: async (id: number, reason: string): Promise<void> => {
    await api.post(`/admin/equipment/${id}/reject`, { reason });
  },

  // Maintenance Logs
  getMaintenanceLogs: async (equipmentId?: number): Promise<MaintenanceLog[]> => {
    const response = await api.get('/admin/maintenance', {
      params: { equipmentId },
    });
    return response.data;
  },

  createMaintenanceLog: async (logData: Partial<MaintenanceLog>): Promise<MaintenanceLog> => {
    const response = await api.post('/admin/maintenance', logData);
    return response.data;
  },

  updateMaintenanceLog: async (id: number, logData: Partial<MaintenanceLog>): Promise<MaintenanceLog> => {
    const response = await api.put(`/admin/maintenance/${id}`, logData);
    return response.data;
  },

  // Reports
  generateReport: async (reportType: string, startDate: string, endDate: string): Promise<Report> => {
    const response = await api.post('/admin/reports/generate', {
      reportType,
      startDate,
      endDate,
    });
    return response.data;
  },

  getAllReports: async (): Promise<Report[]> => {
    const response = await api.get('/admin/reports');
    return response.data;
  },

  downloadReport: async (reportId: number): Promise<Blob> => {
    const response = await api.get(`/admin/reports/${reportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // System Settings
  getSystemSettings: async (): Promise<any> => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSystemSettings: async (settings: any): Promise<any> => {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  },

  // Payments Management
  getAllPayments: async (startDate?: string, endDate?: string): Promise<any[]> => {
    const response = await api.get('/admin/payments', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Bookings Management
  getAllBookingsAdmin: async (filters?: any): Promise<any[]> => {
    const response = await api.get('/admin/bookings', { params: filters });
    return response.data;
  },
};
