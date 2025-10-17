import api from '../utils/axios';

export interface Booking {
  id: number;
  equipmentId: number;
  userId: number;
  startDate: string; // Backend uses LocalDate format (yyyy-MM-dd)
  endDate: string;
  totalPrice: number; // Backend uses totalPrice
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  // Optional fields from frontend/backend
  equipmentName?: string;
  userName?: string;
  operatorId?: number;
  operatorName?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  durationType?: 'hours' | 'days';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  checkInTime?: string;
  checkOutTime?: string;
  qrCodeScanned?: boolean;
  updatedAt?: string;
}

export interface CreateBookingRequest {
  equipmentId: number;
  userId: number; // Backend requires userId
  startDate: string; // yyyy-MM-dd format
  endDate: string; // yyyy-MM-dd format
  totalPrice: number; // Backend requires totalPrice
  status?: string; // Optional, defaults to 'pending'
}

export interface BookingFilter {
  status?: string;
  userId?: number;
  operatorId?: number;
  equipmentId?: number;
  startDate?: string;
  endDate?: string;
}

export const bookingService = {
  // Get all bookings with optional filters
  getAllBookings: async (filters?: BookingFilter): Promise<Booking[]> => {
    const response = await api.get('/bookings', { params: filters });
    return response.data;
  },

  // Get single booking by ID
  getBookingById: async (id: number): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Get user's bookings
  getUserBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  // Get operator's bookings
  getOperatorBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings/operator-bookings');
    return response.data;
  },

  // Create new booking
  createBooking: async (bookingData: CreateBookingRequest): Promise<Booking> => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Update booking status
  updateBookingStatus: async (id: number, status: Booking['status']): Promise<Booking> => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: number, reason?: string): Promise<Booking> => {
    const response = await api.post(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  // Check availability for equipment
  checkAvailability: async (
    equipmentId: number,
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string
  ): Promise<{ available: boolean; conflictingBookings?: Booking[] }> => {
    const response = await api.post('/bookings/check-availability', {
      equipmentId,
      startDate,
      endDate,
      startTime,
      endTime,
    });
    return response.data;
  },

  // QR Code Check-in
  checkIn: async (bookingId: number, qrCode: string): Promise<Booking> => {
    const response = await api.post(`/bookings/${bookingId}/check-in`, { qrCode });
    return response.data;
  },

  // QR Code Check-out
  checkOut: async (bookingId: number, qrCode: string): Promise<Booking> => {
    const response = await api.post(`/bookings/${bookingId}/check-out`, { qrCode });
    return response.data;
  },

  // Calculate booking cost
  calculateCost: async (
    equipmentId: number,
    startDate: string,
    endDate: string,
    durationType: 'hours' | 'days'
  ): Promise<{ totalAmount: number; duration: number }> => {
    const response = await api.post('/bookings/calculate-cost', {
      equipmentId,
      startDate,
      endDate,
      durationType,
    });
    return response.data;
  },
};
