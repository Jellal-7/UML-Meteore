import { useNavigate } from 'react-router-dom';
import FlightSearchForm from '../components/FlightSearchForm';

const destinations = [
  { city: 'New York', code: 'JFK', country: 'États-Unis', price: '450' },
  { city: 'Londres', code: 'LHR', country: 'Royaume-Uni', price: '120' },
  { city: 'Dubaï', code: 'DXB', country: 'Émirats arabes unis', price: '380' },
  { city: 'Tokyo', code: 'NRT', country: 'Japon', price: '650' },
  { city: 'Barcelone', code: 'BCN', country: 'Espagne', price: '89' },
  { city: 'Rome', code: 'FCO', country: 'Italie', price: '110' },
];

export default function HomePage() {
  const navigate = useNavigate();

  const handleSearch = (params) => {
    const query = new URLSearchParams(params).toString();
    navigate(`/search?${query}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Votre prochain vol,<br />à la vitesse de la lumière
            </h1>
            <p className="text-lg md:text-xl text-primary-200 max-w-2xl mx-auto">
              Recherchez, comparez et réservez vos vols en toute simplicité.
              Prix transparents, sans frais cachés.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <FlightSearchForm onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Destinations populaires */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-3xl font-bold text-gray-900 text-center mb-10">
          Destinations populaires
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.code}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 cursor-pointer"
              onClick={() => handleSearch({ from: 'CDG', to: dest.code, passengers: 1, date: '' })}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-gray-100">{dest.city}</h3>
                  <p className="text-sm text-gray-500">{dest.country}</p>
                </div>
                <span className="text-sm font-mono bg-primary-50 text-primary-800 px-2 py-1 rounded">
                  {dest.code}
                </span>
              </div>
              <p className="mt-4 text-lg font-bold text-accent-500">
                à partir de {dest.price} &euro;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pourquoi Météore */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-10">
            Pourquoi choisir Météore ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Recherche simple</h3>
              <p className="text-gray-600 dark:text-gray-400">Trouvez votre vol en quelques clics, sans publicité ni distraction.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Prix transparents</h3>
              <p className="text-gray-600 dark:text-gray-400">Le prix affiché est le prix payé. Aucun frais caché, aucune surprise.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Réservation rapide</h3>
              <p className="text-gray-600 dark:text-gray-400">Réservez et payez en un seul endroit, en moins de 3 minutes.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
