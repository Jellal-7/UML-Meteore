import api from './api';

export const getAllAirports = async (search) => {
  const params = search ? { search } : {};
  const response = await api.get('/airports', { params });
  return response.data;
};

export const createAirport = async (data) => {
  const response = await api.post('/airports', data);
  return response.data;
};

export const updateAirport = async (id, data) => {
  const response = await api.put(`/airports/${id}`, data);
  return response.data;
};

export const deleteAirport = async (id) => {
  const response = await api.delete(`/airports/${id}`);
  return response.data;
};
