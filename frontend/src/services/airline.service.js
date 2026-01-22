import api from './api';

export const getAllAirlines = async () => {
  const response = await api.get('/airlines');
  return response.data;
};

export const createAirline = async (data) => {
  const response = await api.post('/airlines', data);
  return response.data;
};

export const updateAirline = async (id, data) => {
  const response = await api.put(`/airlines/${id}`, data);
  return response.data;
};

export const deleteAirline = async (id) => {
  const response = await api.delete(`/airlines/${id}`);
  return response.data;
};
