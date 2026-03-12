import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getFlightById } from '../services/flight.service';
import { createBooking } from '../services/booking.service';
import PassengerForm from '../components/PassengerForm';
import { formatPrice, formatDateTime, formatDuration } from '../utils/formatters';

const emptyPassenger = { first_name: '', last_name: '', birth_date: '', passport_number: '' };

export default function BookingPage() {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengers, setPassengers] = useState([{ ...emptyPassenger }]);

  useEffect(() => {
    getFlightById(flightId)
      .then((data) => setFlight(data.flight))
      .catch(() => toast.error('Impossible de charger le vol'))
      .finally(() => setLoading(false));
  }, [flightId]);

  const handlePassengerCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setPassengerCount(count);
    setPassengers((prev) => {
      if (count > prev.length) {
        return [...prev, ...Array(count - prev.length).fill(null).map(() => ({ ...emptyPassenger }))];
      }
      return prev.slice(0, count);
    });
  };

  const handlePassengerChange = (index, data) => {
    setPassengers((prev) => prev.map((p, i) => (i === index ? data : p)));
  };

  const totalPrice = flight ? parseFloat(flight.price) * passengerCount : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await createBooking({
        flight_id: parseInt(flightId, 10),
        passengers,
      });
      toast.success('Réservation créée !');
      navigate(`/payment/${data.booking.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de la réservation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 text-lg">Vol non trouvé</p>
      </div>
    );
  }

  const departure = flight.departureAirport;
  const arrival = flight.arrivalAirport;
  const airline = flight.Airline;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Réservation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire passagers */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de passagers
              </label>
              <select
                value={passengerCount}
                onChange={handlePassengerCountChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {Array.from({ length: Math.min(9, flight.available_seats) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4 mb-6">
              {passengers.map((passenger, index) => (
                <PassengerForm
                  key={index}
                  index={index}
                  passenger={passenger}
                  onChange={handlePassengerChange}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              {submitting ? 'Création en cours...' : 'Procéder au paiement'}
            </button>
          </form>
        </div>

        {/* Récapitulatif vol */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Récapitulatif</h2>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                {airline?.logo_url && (
                  <img src={airline.logo_url} alt={airline.name} className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                )}
                <span className="text-sm font-medium">{airline?.name} — {flight.flight_number}</span>
              </div>

              <div className="border-t pt-3">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {departure?.city} ({departure?.iata_code}) → {arrival?.city} ({arrival?.iata_code})
                </p>
                <p className="text-sm text-gray-600">{formatDateTime(flight.departure_at)}</p>
                <p className="text-sm text-gray-600">Durée : {formatDuration(flight.departure_at, flight.arrival_at)}</p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Prix / personne</span>
                <span>{formatPrice(flight.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Passagers</span>
                <span>{passengerCount}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-primary-800">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
