import api from './api';

export const venueService = {
  getAll: () => api.get('/venues'),
};
