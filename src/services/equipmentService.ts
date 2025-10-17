import api from '../utils/axios';

export interface Equipment {
  id: number;
  name: string;
  category: string;
  description: string;
  pricePerDay: number;
  available: boolean;
  operatorId: number;
  condition?: string;
  imageUrl?: string; // Backend uses imageUrl
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number; // Backend uses latitude/longitude
    longitude: number;
  };
  specifications?: Record<string, any>;
  // Optional fields from frontend
  operatorName?: string;
  pricePerHour?: number;
  rating?: number;
  totalBookings?: number;
  maintenanceStatus?: string;
  qrCode?: string;
}

export interface EquipmentFilter {
  category?: string;
  location?: string;
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
}

export const equipmentService = {
  // Get all equipment with optional filters
  getAllEquipment: async (filters?: EquipmentFilter): Promise<Equipment[]> => {
    const response = await api.get('/equipment', { params: filters });
    return response.data;
  },

  // Get single equipment by ID
  getEquipmentById: async (id: number): Promise<Equipment> => {
    const response = await api.get(`/equipment/${id}`);
    return response.data;
  },

  // Get equipment by operator ID
  getEquipmentByOperator: async (operatorId: number): Promise<Equipment[]> => {
    const response = await api.get(`/equipment/operator/${operatorId}`);
    return response.data;
  },

  // Get nearby equipment based on location
  getNearbyEquipment: async (lat: number, lng: number, radius: number = 10): Promise<Equipment[]> => {
    const response = await api.get('/equipment/nearby', {
      params: { lat, lng, radius },
    });
    return response.data;
  },

  // Create new equipment (Operator/Admin only)
  createEquipment: async (equipmentData: Partial<Equipment>): Promise<Equipment> => {
    const response = await api.post('/equipment', equipmentData);
    return response.data;
  },

  // Update equipment (Operator/Admin only)
  updateEquipment: async (id: number, equipmentData: Partial<Equipment>): Promise<Equipment> => {
    const response = await api.put(`/equipment/${id}`, equipmentData);
    return response.data;
  },

  // Delete equipment (Operator/Admin only)
  deleteEquipment: async (id: number): Promise<void> => {
    await api.delete(`/equipment/${id}`);
  },

  // Update equipment availability
  updateAvailability: async (id: number, available: boolean): Promise<Equipment> => {
    const response = await api.patch(`/equipment/${id}/availability`, { available });
    return response.data;
  },

  // Get equipment categories
  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/equipment/categories');
    return response.data;
  },

  // Get equipment QR code
  getQRCode: async (id: number): Promise<string> => {
    const response = await api.get(`/equipment/${id}/qr-code`);
    return response.data;
  },
};
