import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getBookingById, cancelBooking } from '../services/booking.service';
import { formatPrice, formatDateTime, formatDuration, formatDate, getStatusLabel, getStatusColor } from '../utils/formatters';

export default function BookingDetailPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = () => {
    setLoading(true);
    getBookingById(id)
      .then((data) => setBooking(data.booking))
      .catch(() => toast.error('Réservation non trouvée'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooking();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancel = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;
    try {
      await cancelBooking(id);
      toast.success('Réservation annulée');
      fetchBooking();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de l\'annulation');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 text-lg">Réservation non trouvée</p>
      </div>
    );
  }

  const flight = booking.Flight;
  const departure = flight?.departureAirport;
  const arrival = flight?.arrivalAirport;
  const airline = flight?.Airline;
  const payment = booking.Payment;
  const isFuture = flight && new Date(flight.departure_at) > new Date();
  const canCancel = booking.status !== 'cancelled' && isFuture;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/my-bookings" className="text-primary-600 hover:underline text-sm mb-6 inline-block">
        &larr; Mes réservations
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-primary-800 text-white p-6 flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">Réservation #{booking.id}</h1>
            <p className="text-primary-200 text-sm">
              Créée le {formatDateTime(booking.created_at)}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
            {getStatusLabel(booking.status)}
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Vol */}
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Vol</h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                {airline?.logo_url && (
                  <img src={airline.logo_url} alt={airline.name} className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                )}
                <span className="font-medium">{airline?.name} — {flight?.flight_number}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Départ</p>
                  <p className="font-semibold">{departure?.city} ({departure?.iata_code})</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formatDateTime(flight?.departure_at)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Durée</p>
                  <p className="font-semibold">{formatDuration(flight?.departure_at, flight?.arrival_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Arrivée</p>
                  <p className="font-semibold">{arrival?.city} ({arrival?.iata_code})</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formatDateTime(flight?.arrival_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Passagers */}
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Passagers ({booking.Passengers?.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {booking.Passengers?.map((p, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="font-medium">{p.first_name} {p.last_name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Né(e) le {formatDate(p.birth_date)}</p>
                  {p.passport_number && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Passeport : {p.passport_number}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Paiement */}
          {payment && (
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Paiement</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between">
                  <span>Statut</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                    {getStatusLabel(payment.status)}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Montant</span>
                  <span className="font-bold">{formatPrice(payment.amount)}</span>
                </div>
                {payment.processed_at && (
                  <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Date</span>
                    <span>{formatDateTime(payment.processed_at)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Total</span>
            <span className="text-2xl font-bold text-primary-800">{formatPrice(booking.total_price)}</span>
          </div>

          {/* Actions */}
          {canCancel && (
            <div className="border-t pt-4">
              <button
                onClick={handleCancel}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
              >
                Annuler cette réservation
              </button>
            </div>
          )}

          {booking.status === 'pending' && (
            <div className="border-t pt-4">
              <Link
                to={`/payment/${booking.id}`}
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
              >
                Procéder au paiement
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
