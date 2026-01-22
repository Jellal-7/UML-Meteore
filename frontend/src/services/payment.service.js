import api from './api';

export const processPayment = async (bookingId, paymentData) => {
  const response = await api.post(`/payments/${bookingId}/pay`, paymentData);
  return response.data;
};

export const getPaymentByBooking = async (bookingId) => {
  const response = await api.get(`/payments/${bookingId}`);
  return response.data;
};
