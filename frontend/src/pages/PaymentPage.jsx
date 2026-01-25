import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getBookingById } from '../services/booking.service';
import { processPayment } from '../services/payment.service';
import PaymentForm from '../components/PaymentForm';
import { formatPrice, formatDateTime, formatDuration } from '../utils/formatters';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    getBookingById(bookingId)
      .then((data) => setBooking(data.booking))
      .catch(() => toast.error('Impossible de charger la réservation'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handlePayment = async (paymentData) => {
    setPaying(true);
    try {
      await processPayment(bookingId, paymentData);
      toast.success('Paiement accepté ! Réservation confirmée.');
      navigate(`/confirmation/${bookingId}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Paiement refusé');
    } finally {
      setPaying(false);
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-6">Paiement</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de paiement */}
        <div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Informations de paiement</h2>
            <PaymentForm onPayment={handlePayment} loading={paying} />
          </div>
        </div>

        {/* Récapitulatif */}
        <div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Récapitulatif de la commande</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {airline?.logo_url && (
                  <img src={airline.logo_url} alt={airline.name} className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                )}
                <span className="font-medium">{airline?.name} — {flight?.flight_number}</span>
              </div>

              <div className="border-t pt-3">
                <p className="font-semibold">
                  {departure?.city} ({departure?.iata_code}) → {arrival?.city} ({arrival?.iata_code})
                </p>
                <p className="text-sm text-gray-600">{formatDateTime(flight?.departure_at)}</p>
                <p className="text-sm text-gray-600">Durée : {formatDuration(flight?.departure_at, flight?.arrival_at)}</p>
              </div>

              <div className="border-t pt-3">
                <h3 className="font-medium text-gray-900 mb-2">Passagers ({booking.Passengers?.length})</h3>
                {booking.Passengers?.map((p, i) => (
                  <p key={i} className="text-sm text-gray-600">
                    {p.first_name} {p.last_name}
                  </p>
                ))}
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-xl">
                  <span>Total à payer</span>
                  <span className="text-primary-800">{formatPrice(booking.total_price)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
