import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookingById } from '../services/booking.service';
import { formatPrice, formatDateTime, formatDuration, getStatusLabel, getStatusColor } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export default function ConfirmationPage() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    getBookingById(bookingId)
      .then((data) => {
        setBooking(data.booking);
        // Simulate email sending delay
        setTimeout(() => setEmailSent(true), 1500);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [bookingId]);

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-gray-100">Réservation confirmée !</h1>
        <p className="text-gray-600 mt-2">Votre réservation a été enregistrée avec succès.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-primary-800 text-white p-4 flex justify-between items-center">
          <span className="font-semibold">Réservation #{booking.id}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
            {getStatusLabel(booking.status)}
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Vol */}
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Détails du vol</h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {airline?.logo_url && (
                  <img src={airline.logo_url} alt={airline.name} className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                )}
                <span className="font-medium">{airline?.name} — {flight?.flight_number}</span>
              </div>
              <p className="font-semibold text-lg">
                {departure?.city} ({departure?.iata_code}) → {arrival?.city} ({arrival?.iata_code})
              </p>
              <p className="text-sm text-gray-600">{formatDateTime(flight?.departure_at)}</p>
              <p className="text-sm text-gray-600">Durée : {formatDuration(flight?.departure_at, flight?.arrival_at)}</p>
            </div>
          </div>

          {/* Passagers */}
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Passagers</h2>
            <div className="space-y-2">
              {booking.Passengers?.map((p, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex justify-between">
                  <span>{p.first_name} {p.last_name}</span>
                  <span className="text-sm text-gray-500">{p.passport_number}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prix */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total payé</span>
              <span className="text-primary-800">{formatPrice(booking.total_price)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Email confirmation simulation */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {emailSent ? (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
            )}
          </div>
          <div>
            <p className="font-semibold text-green-800">
              {emailSent ? 'Email de confirmation envoyé !' : 'Envoi de l\'email de confirmation...'}
            </p>
            <p className="text-sm text-green-700 mt-1">
              {emailSent
                ? `Un récapitulatif de votre réservation a été envoyé à ${user?.email || 'votre adresse email'}.`
                : 'Veuillez patienter...'}
            </p>
            {emailSent && (
              <div className="mt-3 bg-white rounded-lg p-3 border border-green-100 text-sm text-gray-700">
                <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Objet : Confirmation de réservation #{booking?.id} — Météore</p>
                <p>Bonjour {user?.first_name || 'cher client'},</p>
                <p className="mt-1">Votre réservation pour le vol {flight?.flight_number} ({departure?.city} → {arrival?.city}) le {formatDateTime(flight?.departure_at)} a bien été confirmée.</p>
                <p className="mt-1">Montant total : {formatPrice(booking?.total_price)}</p>
                <p className="mt-2 text-gray-500 italic">— L'équipe Météore</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center mt-8">
        <Link
          to="/my-bookings"
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          Mes réservations
        </Link>
        <Link
          to="/"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
