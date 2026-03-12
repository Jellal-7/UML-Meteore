import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFlightById } from '../services/flight.service';
import { formatPrice, formatDateTime, formatDuration, getStatusLabel, getStatusColor } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export default function FlightDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getFlightById(id)
      .then((data) => setFlight(data.flight))
      .catch((err) => setError(err.response?.data?.error || 'Erreur lors du chargement'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 text-lg">{error || 'Vol non trouvé'}</p>
        <Link to="/search" className="text-primary-600 hover:underline mt-4 inline-block">
          Retour à la recherche
        </Link>
      </div>
    );
  }

  const departure = flight.departureAirport;
  const arrival = flight.arrivalAirport;
  const airline = flight.Airline;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/search" className="text-primary-600 hover:underline text-sm mb-6 inline-block">
        &larr; Retour aux résultats
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {airline?.logo_url && (
                <img src={airline.logo_url} alt={airline.name} className="w-10 h-10 object-contain bg-white rounded-lg p-1" onError={(e) => { e.target.style.display = 'none'; }} />
              )}
              <div>
                <h1 className="font-display text-2xl font-bold">{airline?.name}</h1>
                <p className="text-primary-200">Vol {flight.flight_number}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(flight.status)}`}>
              {getStatusLabel(flight.status)}
            </span>
          </div>
        </div>

        {/* Itinéraire */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{departure?.iata_code}</p>
              <p className="text-lg text-gray-700">{departure?.city}</p>
              <p className="text-sm text-gray-500">{departure?.name}</p>
              <p className="text-sm font-medium text-primary-600 mt-2">
                {formatDateTime(flight.departure_at)}
              </p>
            </div>

            <div className="flex-1 mx-8 text-center">
              <p className="text-sm text-gray-500 mb-2">
                {formatDuration(flight.departure_at, flight.arrival_at)}
              </p>
              <div className="flex items-center">
                <div className="h-px bg-gray-300 flex-1"></div>
                <svg className="w-6 h-6 text-primary-500 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Vol direct</p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{arrival?.iata_code}</p>
              <p className="text-lg text-gray-700">{arrival?.city}</p>
              <p className="text-sm text-gray-500">{arrival?.name}</p>
              <p className="text-sm font-medium text-primary-600 mt-2">
                {formatDateTime(flight.arrival_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Infos & Prix */}
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Places disponibles :</span>{' '}
              <span className={flight.available_seats < 10 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                {flight.available_seats}
              </span>{' '}
              / {flight.total_seats}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Pays de départ :</span> {departure?.country}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Pays d'arrivée :</span> {arrival?.country}
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-4xl font-bold text-primary-800">{formatPrice(flight.price)}</p>
            <p className="text-sm text-gray-500 mb-4">par personne</p>
            {flight.status === 'scheduled' && flight.available_seats > 0 ? (
              isAuthenticated ? (
                <Link
                  to={`/booking/${flight.id}`}
                  className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg"
                >
                  Réserver ce vol
                </Link>
              ) : (
                <Link
                  to="/login"
                  state={{ from: `/booking/${flight.id}` }}
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg"
                >
                  Se connecter pour réserver
                </Link>
              )
            ) : (
              <p className="text-red-600 font-medium">Ce vol n'est pas disponible à la réservation.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
