import api from './api';

export const searchFlights = async (params) => {
  const response = await api.get('/flights/search', { params });
  return response.data;
};

export const getFlightById = async (id) => {
  const response = await api.get(`/flights/${id}`);
  return response.data;
};

export const createFlight = async (data) => {
  const response = await api.post('/flights', data);
  return response.data;
};

export const updateFlight = async (id, data) => {
  const response = await api.put(`/flights/${id}`, data);
  return response.data;
};

export const deleteFlight = async (id) => {
  const response = await api.delete(`/flights/${id}`);
  return response.data;
};
