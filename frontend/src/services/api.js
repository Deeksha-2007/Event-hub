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

// ─── Event Service ────────────────────────────────────────────────────────────
export const eventService = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  getMyEvents: (params) => api.get('/events/my-events', { params }),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  patch: (id, data) => api.patch(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

// ─── Review Service ───────────────────────────────────────────────────────────
export const reviewService = {
  getByEvent: (eventId) => api.get(`/reviews/event/${eventId}`),
  create: (eventId, data) => api.post(`/reviews/event/${eventId}`, data),
  update: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

// ─── Venue Service ────────────────────────────────────────────────────────────
export const venueService = {
  getAll: () => api.get('/venues'),
};

// ─── Ticket Service ───────────────────────────────────────────────────────────
export const ticketService = {
  getByEventId: (eventId) => api.get(`/tickets/event/${eventId}`),
  create: (eventId, data) => api.post(`/tickets/event/${eventId}`, data),
};

// ─── Booking Service ──────────────────────────────────────────────────────────
export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

// ─── Auth Service ─────────────────────────────────────────────────────────────
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// ─── Dashboard Service ────────────────────────────────────────────────────────
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getMyEvents: (params) => api.get('/dashboard/my-events', { params }),
  getBookings: (params) => api.get('/dashboard/bookings', { params }),
  getAnalytics: () => api.get('/dashboard/analytics'),
  getEventAttendees: (eventId) => api.get(`/dashboard/events/${eventId}/attendees`),
};

export default api;
