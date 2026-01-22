import api from './api';

export const createBooking = async (data) => {
  const response = await api.post('/bookings', data);
  return response.data;
};

export const getUserBookings = async () => {
  const response = await api.get('/bookings/my');
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.patch(`/bookings/${id}/cancel`);
  return response.data;
};

export const getAllBookings = async (params) => {
  const response = await api.get('/bookings/admin/all', { params });
  return response.data;
};
