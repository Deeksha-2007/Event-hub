import api from './api';

export const ticketService = {
  getByEventId: (eventId) => api.get(`/tickets/event/${eventId}`),
};
