import api from './api';

export const paymentService = {
  process: (paymentData) => api.post('/payments/process', paymentData),
  getByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
};
