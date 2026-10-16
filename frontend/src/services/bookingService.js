import api from './api';

export const bookingService = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};
