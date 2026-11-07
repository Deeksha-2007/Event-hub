import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear auth and redirect to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const eventService = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

export const venueService = {
  getAll: () => api.get('/venues'),
};

export const ticketService = {
  getByEventId: (eventId) => api.get(`/tickets/event/${eventId}`),
  create: (eventId, data) => api.post(`/tickets/event/${eventId}`, data),
};

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getMyEvents: (params) => api.get('/dashboard/my-events', { params }),
  getBookings: (params) => api.get('/dashboard/bookings', { params }),
  getAnalytics: () => api.get('/dashboard/analytics'),
  getEventAttendees: (eventId) => api.get(`/dashboard/events/${eventId}/attendees`),
};

export default api;
