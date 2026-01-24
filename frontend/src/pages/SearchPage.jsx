import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FlightSearchForm from '../components/FlightSearchForm';
import FlightCard from '../components/FlightCard';
import { useFlightSearch } from '../hooks/useFlightSearch';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { flights, loading, error, searched, search } = useFlightSearch();

  const initialValues = {
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || '',
    passengers: searchParams.get('passengers') || 1,
  };

  useEffect(() => {
    if (initialValues.from && initialValues.to) {
      search(initialValues);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (params) => {
    const cleanParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value) cleanParams[key] = value;
    });
    setSearchParams(cleanParams);
    search(cleanParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-6">Rechercher un vol</h1>

      <div className="mb-8">
        <FlightSearchForm onSearch={handleSearch} initialValues={initialValues} />
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {searched && !loading && !error && (
        <div>
          <p className="text-gray-600 mb-4">
            {flights.length} vol{flights.length !== 1 ? 's' : ''} trouvé{flights.length !== 1 ? 's' : ''}
          </p>

          {flights.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-lg">Aucun vol ne correspond à votre recherche.</p>
              <p className="text-gray-400 text-sm mt-1">Essayez de modifier vos critères.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {flights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}
        </div>
      )}

      {!searched && !loading && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500 text-lg">Lancez une recherche pour trouver votre vol.</p>
        </div>
      )}
    </div>
  );
}
