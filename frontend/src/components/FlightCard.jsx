import { Link } from 'react-router-dom';
import { formatPrice, formatTime, formatDuration } from '../utils/formatters';

export default function FlightCard({ flight }) {
  const departure = flight.departureAirport || flight.departure_airport;
  const arrival = flight.arrivalAirport || flight.arrival_airport;
  const airline = flight.Airline || flight.airline;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Compagnie */}
        <div className="flex items-center gap-3 md:w-1/6">
          {airline?.logo_url && (
            <img
              src={airline.logo_url}
              alt={airline.name}
              className="w-8 h-8 object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">{airline?.name}</p>
            <p className="text-xs text-gray-500">{flight.flight_number}</p>
          </div>
        </div>

        {/* Itinéraire */}
        <div className="flex items-center gap-4 md:w-2/5">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{formatTime(flight.departure_at)}</p>
            <p className="text-sm text-gray-600">{departure?.iata_code}</p>
            <p className="text-xs text-gray-400">{departure?.city}</p>
          </div>

          <div className="flex-1 flex flex-col items-center px-2">
            <p className="text-xs text-gray-500 mb-1">
              {formatDuration(flight.departure_at, flight.arrival_at)}
            </p>
            <div className="w-full flex items-center">
              <div className="h-px bg-gray-300 flex-1"></div>
              <svg className="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Direct</p>
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{formatTime(flight.arrival_at)}</p>
            <p className="text-sm text-gray-600">{arrival?.iata_code}</p>
            <p className="text-xs text-gray-400">{arrival?.city}</p>
          </div>
        </div>

        {/* Places */}
        <div className="text-center md:w-1/6">
          <p className={`text-sm font-medium ${flight.available_seats < 10 ? 'text-red-600' : 'text-green-600'}`}>
            {flight.available_seats} places
          </p>
        </div>

        {/* Prix & Action */}
        <div className="text-center md:text-right md:w-1/6">
          <p className="text-2xl font-bold text-primary-800">{formatPrice(flight.price)}</p>
          <p className="text-xs text-gray-500 mb-2">par personne</p>
          <Link
            to={`/flights/${flight.id}`}
            className="inline-block bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold py-2 px-5 rounded-lg transition-colors"
          >
            Voir le vol
          </Link>
        </div>
      </div>
    </div>
  );
}
