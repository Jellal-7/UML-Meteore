import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FlightSearchForm from '../components/FlightSearchForm';
import FlightCard from '../components/FlightCard';
import { useFlightSearch } from '../hooks/useFlightSearch';
import { getAllAirlines } from '../services/airline.service';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { flights, loading, error, searched, search } = useFlightSearch();
  const outbound = useFlightSearch();
  const returnLeg = useFlightSearch();
  const [airlines, setAirlines] = useState([]);
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    price_max: '',
    airline_id: '',
    sort: 'price',
  });

  useEffect(() => {
    getAllAirlines().then((data) => setAirlines(data.airlines || [])).catch(() => {});
  }, []);

  const initialValues = {
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || '',
    returnDate: searchParams.get('returnDate') || '',
    passengers: searchParams.get('passengers') || 1,
  };

  const doSearch = (params, activeFilters) => {
    const merged = { ...params, ...activeFilters };
    Object.keys(merged).forEach((k) => { if (!merged[k]) delete merged[k]; });

    if (params.returnDate) {
      setIsRoundTrip(true);
      const outParams = { ...merged };
      delete outParams.returnDate;
      outbound.search(outParams);

      const retParams = { ...merged, from: params.to, to: params.from, date: params.returnDate };
      delete retParams.returnDate;
      returnLeg.search(retParams);
    } else {
      setIsRoundTrip(false);
      outbound.search(merged);
    }
  };

  useEffect(() => {
    if (initialValues.from && initialValues.to) {
      doSearch(initialValues, filters);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [lastParams, setLastParams] = useState(initialValues);

  const handleSearch = (params) => {
    const cleanParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value) cleanParams[key] = value;
    });
    setSearchParams(cleanParams);
    setLastParams(params);
    doSearch(params, filters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    if (outbound.searched || lastParams.from) {
      doSearch(lastParams, newFilters);
    }
  };

  const resetFilters = () => {
    const cleared = { price_max: '', airline_id: '', sort: 'price' };
    setFilters(cleared);
    if (outbound.searched || lastParams.from) {
      doSearch(lastParams, cleared);
    }
  };

  const renderResults = (label, hook) => {
    if (hook.loading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (hook.error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">
          {hook.error}
        </div>
      );
    }

    if (!hook.searched) return null;

    const list = hook.flights;
    return (
      <div className="mb-8">
        {label && <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{label}</h2>}
        <p className="text-gray-600 mb-4">
          {list.length} vol{list.length !== 1 ? 's' : ''} trouvé{list.length !== 1 ? 's' : ''}
        </p>

        {list.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500">Aucun vol ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const hasSearched = outbound.searched;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Rechercher un vol</h1>

      <div className="mb-8">
        <FlightSearchForm onSearch={handleSearch} initialValues={initialValues} />
      </div>

      {/* Filtres */}
      {hasSearched && (
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Prix max (EUR)</label>
              <input
                type="number"
                name="price_max"
                value={filters.price_max}
                onChange={handleFilterChange}
                placeholder="Illimité"
                min="0"
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 w-32 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Compagnie</label>
              <select
                name="airline_id"
                value={filters.airline_id}
                onChange={handleFilterChange}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              >
                <option value="">Toutes</option>
                {airlines.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Trier par</label>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              >
                <option value="price">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="departure">Heure de départ</option>
                <option value="duration">Durée</option>
              </select>
            </div>
            <button
              onClick={resetFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium py-2"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      {/* Résultats */}
      {isRoundTrip ? (
        <>
          {renderResults('Vols aller', outbound)}
          {renderResults('Vols retour', returnLeg)}
        </>
      ) : (
        renderResults(null, outbound)
      )}

      {!hasSearched && !outbound.loading && (
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
