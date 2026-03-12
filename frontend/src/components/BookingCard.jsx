import { Link } from 'react-router-dom';
import { formatPrice, formatDateTime, formatDuration, getStatusLabel, getStatusColor } from '../utils/formatters';

export default function BookingCard({ booking, onCancel }) {
  const flight = booking.Flight;
  const departure = flight?.departureAirport || flight?.departure_airport;
  const arrival = flight?.arrivalAirport || flight?.arrival_airport;
  const airline = flight?.Airline || flight?.airline;
  const passengerCount = booking.Passengers?.length || 0;
  const isFuture = flight && new Date(flight.departure_at) > new Date();
  const canCancel = booking.status !== 'cancelled' && isFuture;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
              {getStatusLabel(booking.status)}
            </span>
            <span className="text-sm text-gray-500">
              Réservation #{booking.id}
            </span>
          </div>

          {flight && (
            <div className="mb-2">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {departure?.city} ({departure?.iata_code}) → {arrival?.city} ({arrival?.iata_code})
              </p>
              <p className="text-sm text-gray-600">
                {airline?.name} — {flight.flight_number} | {formatDateTime(flight.departure_at)} | Durée : {formatDuration(flight.departure_at, flight.arrival_at)}
              </p>
            </div>
          )}

          <p className="text-sm text-gray-600">
            {passengerCount} passager{passengerCount > 1 ? 's' : ''}
          </p>
        </div>

        <div className="text-right space-y-2">
          <p className="text-xl font-bold text-primary-800">{formatPrice(booking.total_price)}</p>
          <div className="flex gap-2 justify-end">
            <Link
              to={`/bookings/${booking.id}`}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              Détails
            </Link>
            {canCancel && onCancel && (
              <button
                onClick={() => onCancel(booking.id)}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
