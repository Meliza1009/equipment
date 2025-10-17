import api from '../utils/axios';

export interface Feedback {
  id: number;
  bookingId: number;
  equipmentId: number;
  equipmentName: string;
  userId: number;
  userName: string;
  operatorId: number;
  rating: number;
  comment: string;
  equipmentCondition?: 'excellent' | 'good' | 'fair' | 'poor';
  serviceRating?: number;
  createdAt: string;
  response?: string;
  respondedAt?: string;
}

export interface CreateFeedbackRequest {
  bookingId: number;
  equipmentId: number;
  rating: number;
  comment: string;
  equipmentCondition?: 'excellent' | 'good' | 'fair' | 'poor';
  serviceRating?: number;
}

export const feedbackService = {
  // Get all feedback
  getAllFeedback: async (): Promise<Feedback[]> => {
    const response = await api.get('/feedback');
    return response.data;
  },

  // Get feedback for specific equipment
  getEquipmentFeedback: async (equipmentId: number): Promise<Feedback[]> => {
    const response = await api.get(`/feedback/equipment/${equipmentId}`);
    return response.data;
  },

  // Get feedback for specific operator
  getOperatorFeedback: async (operatorId: number): Promise<Feedback[]> => {
    const response = await api.get(`/feedback/operator/${operatorId}`);
    return response.data;
  },

  // Get user's feedback
  getUserFeedback: async (): Promise<Feedback[]> => {
    const response = await api.get('/feedback/my-feedback');
    return response.data;
  },

  // Create new feedback
  createFeedback: async (feedbackData: CreateFeedbackRequest): Promise<Feedback> => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },

  // Update feedback
  updateFeedback: async (id: number, feedbackData: Partial<CreateFeedbackRequest>): Promise<Feedback> => {
    const response = await api.put(`/feedback/${id}`, feedbackData);
    return response.data;
  },

  // Delete feedback
  deleteFeedback: async (id: number): Promise<void> => {
    await api.delete(`/feedback/${id}`);
  },

  // Operator response to feedback
  respondToFeedback: async (id: number, response: string): Promise<Feedback> => {
    const responseData = await api.post(`/feedback/${id}/respond`, { response });
    return responseData.data;
  },

  // Get average rating for equipment
  getEquipmentRating: async (equipmentId: number): Promise<{ averageRating: number; totalReviews: number }> => {
    const response = await api.get(`/feedback/equipment/${equipmentId}/rating`);
    return response.data;
  },

  // Get average rating for operator
  getOperatorRating: async (operatorId: number): Promise<{ averageRating: number; totalReviews: number }> => {
    const response = await api.get(`/feedback/operator/${operatorId}/rating`);
    return response.data;
  },
};
