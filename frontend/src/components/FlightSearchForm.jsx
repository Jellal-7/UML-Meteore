import { useState, useEffect } from 'react';
import { getAllAirports } from '../services/airport.service';

export default function FlightSearchForm({ onSearch, initialValues = {} }) {
  const [airports, setAirports] = useState([]);
  const [tripType, setTripType] = useState(initialValues.returnDate ? 'round' : 'oneway');
  const [form, setForm] = useState({
    from: initialValues.from || '',
    to: initialValues.to || '',
    date: initialValues.date || '',
    returnDate: initialValues.returnDate || '',
    passengers: initialValues.passengers || 1,
  });

  useEffect(() => {
    const fetchAirports = (retries = 3) => {
      getAllAirports()
        .then((data) => setAirports(data.airports || []))
        .catch(() => { if (retries > 0) setTimeout(() => fetchAirports(retries - 1), 3000); });
    };
    fetchAirports();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form };
    if (tripType === 'oneway') delete data.returnDate;
    onSearch(data);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="tripType" value="oneway" checked={tripType === 'oneway'} onChange={() => { setTripType('oneway'); setForm((p) => ({ ...p, returnDate: '' })); }} className="accent-primary-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aller simple</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="tripType" value="round" checked={tripType === 'round'} onChange={() => setTripType('round')} className="accent-primary-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aller-retour</span>
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Départ</label>
          <select
            name="from"
            value={form.from}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Ville / Aéroport</option>
            {airports.map((a) => (
              <option key={a.id} value={a.iata_code}>
                {a.city} ({a.iata_code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Arrivée</label>
          <select
            name="to"
            value={form.to}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Ville / Aéroport</option>
            {airports.map((a) => (
              <option key={a.id} value={a.iata_code}>
                {a.city} ({a.iata_code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de départ</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {tripType === 'round' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de retour</label>
            <input
              type="date"
              name="returnDate"
              value={form.returnDate}
              onChange={handleChange}
              required
              min={form.date || new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Passagers</label>
          <input
            type="number"
            name="passengers"
            value={form.passengers}
            onChange={handleChange}
            min="1"
            max="9"
            required
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
          >
            Rechercher
          </button>
        </div>
      </div>
    </form>
  );
}
