import { useState, useCallback } from 'react';
import { searchFlights } from '../services/flight.service';

export function useFlightSearch() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await searchFlights(params);
      setFlights(data.flights || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la recherche');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setFlights([]);
    setSearched(false);
    setError(null);
  }, []);

  return { flights, loading, error, searched, search, reset };
}
