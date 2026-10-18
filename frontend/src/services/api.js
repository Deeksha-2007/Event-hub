import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventService = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
};

export const venueService = {
  getAll: () => api.get('/venues'),
};

export const ticketService = {
  getByEventId: (eventId) => api.get(`/tickets/event/${eventId}`),
};

export default api;
