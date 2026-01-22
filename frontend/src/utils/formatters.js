import { format, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatPrice(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatDate(isoString) {
  if (!isoString) return '';
  return format(new Date(isoString), 'dd MMM yyyy', { locale: fr });
}

export function formatDateTime(isoString) {
  if (!isoString) return '';
  return format(new Date(isoString), 'dd MMM yyyy à HH:mm', { locale: fr });
}

export function formatTime(isoString) {
  if (!isoString) return '';
  return format(new Date(isoString), 'HH:mm', { locale: fr });
}

export function formatDuration(departureAt, arrivalAt) {
  if (!departureAt || !arrivalAt) return '';
  const minutes = differenceInMinutes(new Date(arrivalAt), new Date(departureAt));
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins.toString().padStart(2, '0')}`;
}

export function getStatusLabel(status) {
  const labels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    cancelled: 'Annulée',
    completed: 'Terminé',
    failed: 'Échoué',
    scheduled: 'Programmé',
  };
  return labels[status] || status;
}

export function getStatusColor(status) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    scheduled: 'bg-blue-100 text-blue-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
