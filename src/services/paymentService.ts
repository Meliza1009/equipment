import api from '../utils/axios';

export interface Payment {
  id: number;
  bookingId: number;
  userId: number;
  amount: number;
  paymentMethod: 'razorpay' | 'paytm' | 'upi' | 'cash';
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentDate: string;
  refundAmount?: number;
  refundDate?: string;
}

export interface CreatePaymentRequest {
  bookingId: number;
  amount: number;
  paymentMethod: 'razorpay' | 'paytm' | 'upi';
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

export interface Fine {
  id: number;
  bookingId: number;
  userId: number;
  amount: number;
  reason: string;
  daysOverdue: number;
  status: 'pending' | 'paid' | 'waived';
  createdAt: string;
  paidAt?: string;
}

export const paymentService = {
  // Create Razorpay order
  createRazorpayOrder: async (bookingId: number, amount: number): Promise<RazorpayOrderResponse> => {
    const response = await api.post('/payments/razorpay/create-order', {
      bookingId,
      amount,
    });
    return response.data;
  },

  // Verify Razorpay payment
  verifyRazorpayPayment: async (
    orderId: string,
    paymentId: string,
    signature: string,
    bookingId: number
  ): Promise<Payment> => {
    const response = await api.post('/payments/razorpay/verify', {
      orderId,
      paymentId,
      signature,
      bookingId,
    });
    return response.data;
  },

  // Get payment by booking ID
  getPaymentByBookingId: async (bookingId: number): Promise<Payment> => {
    const response = await api.get(`/payments/booking/${bookingId}`);
    return response.data;
  },

  // Get user's payment history
  getPaymentHistory: async (): Promise<Payment[]> => {
    const response = await api.get('/payments/history');
    return response.data;
  },

  // Process refund
  processRefund: async (paymentId: number, amount: number, reason: string): Promise<Payment> => {
    const response = await api.post(`/payments/${paymentId}/refund`, {
      amount,
      reason,
    });
    return response.data;
  },

  // Get all fines for user
  getUserFines: async (): Promise<Fine[]> => {
    const response = await api.get('/payments/fines');
    return response.data;
  },

  // Calculate late fine
  calculateLateFine: async (bookingId: number): Promise<{ fineAmount: number; daysOverdue: number }> => {
    const response = await api.get(`/payments/fines/calculate/${bookingId}`);
    return response.data;
  },

  // Pay fine
  payFine: async (fineId: number, paymentMethod: string): Promise<Fine> => {
    const response = await api.post(`/payments/fines/${fineId}/pay`, { paymentMethod });
    return response.data;
  },

  // Waive fine (Admin only)
  waiveFine: async (fineId: number, reason: string): Promise<Fine> => {
    const response = await api.post(`/payments/fines/${fineId}/waive`, { reason });
    return response.data;
  },

  // Get operator earnings
  getOperatorEarnings: async (startDate?: string, endDate?: string) => {
    const response = await api.get('/payments/operator/earnings', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Get transaction details
  getTransactionDetails: async (transactionId: string): Promise<Payment> => {
    const response = await api.get(`/payments/transaction/${transactionId}`);
    return response.data;
  },
};
