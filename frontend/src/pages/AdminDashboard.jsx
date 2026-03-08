import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { searchFlights, createFlight, updateFlight, deleteFlight } from '../services/flight.service';
import { getAllAirports, createAirport, updateAirport, deleteAirport } from '../services/airport.service';
import { getAllAirlines, createAirline, updateAirline, deleteAirline } from '../services/airline.service';
import { getAllBookings } from '../services/booking.service';
import { formatPrice, formatDateTime, getStatusLabel, getStatusColor } from '../utils/formatters';

function StatCard({ title, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className={`rounded-xl border p-6 ${colors[color] || colors.blue}`}>
      <p className="text-sm font-medium opacity-75">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('dashboard');
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalBookings: 0, revenue: 0, cancelRate: 0, activeFlights: 0 });
  const [loading, setLoading] = useState(false);

  const [bookingFilter, setBookingFilter] = useState('all');

  // Modal state
  const [modal, setModal] = useState({ open: false, type: '', entity: null });
  const [formData, setFormData] = useState({});

  const filteredBookings = bookingFilter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === bookingFilter);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [flightsRes, airportsRes, airlinesRes, bookingsRes] = await Promise.all([
        searchFlights({}),
        getAllAirports(),
        getAllAirlines(),
        getAllBookings({ limit: 100 }),
      ]);

      setFlights(flightsRes.flights || []);
      setAirports(airportsRes.airports || []);
      setAirlines(airlinesRes.airlines || []);

      const allBookings = bookingsRes.bookings || [];
      setBookings(allBookings);

      const confirmed = allBookings.filter((b) => b.status === 'confirmed');
      const cancelled = allBookings.filter((b) => b.status === 'cancelled');
      const revenue = confirmed.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);

      setStats({
        totalBookings: allBookings.length,
        revenue,
        cancelRate: allBookings.length > 0 ? Math.round((cancelled.length / allBookings.length) * 100) : 0,
        activeFlights: (flightsRes.flights || []).filter((f) => f.status === 'scheduled').length,
      });
    } catch {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openModal = (type, entity = null) => {
    setModal({ open: true, type, entity });
    if (entity) {
      setFormData({ ...entity });
    } else {
      setFormData({});
    }
  };

  const closeModal = () => {
    setModal({ open: false, type: '', entity: null });
    setFormData({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (modal.type === 'flight') {
        if (modal.entity) {
          await updateFlight(modal.entity.id, formData);
        } else {
          await createFlight(formData);
        }
      } else if (modal.type === 'airport') {
        if (modal.entity) {
          await updateAirport(modal.entity.id, formData);
        } else {
          await createAirport(formData);
        }
      } else if (modal.type === 'airline') {
        if (modal.entity) {
          await updateAirline(modal.entity.id, formData);
        } else {
          await createAirline(formData);
        }
      }
      toast.success('Enregistré avec succès');
      closeModal();
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    try {
      if (type === 'flight') await deleteFlight(id);
      else if (type === 'airport') await deleteAirport(id);
      else if (type === 'airline') await deleteAirline(id);
      toast.success('Supprimé');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord' },
    { id: 'flights', label: 'Vols' },
    { id: 'airports', label: 'Aéroports' },
    { id: 'airlines', label: 'Compagnies' },
    { id: 'bookings', label: 'Réservations' },
  ];

  if (loading && flights.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-6">Administration</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 flex-wrap bg-gray-100 rounded-lg p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Réservations totales" value={stats.totalBookings} color="blue" />
          <StatCard title="Chiffre d'affaires" value={formatPrice(stats.revenue)} color="green" />
          <StatCard title="Taux d'annulation" value={`${stats.cancelRate}%`} color="red" />
          <StatCard title="Vols actifs" value={stats.activeFlights} color="purple" />
        </div>
      )}

      {/* Flights */}
      {tab === 'flights' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Gestion des vols</h2>
            <button onClick={() => openModal('flight')} className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
              Ajouter un vol
            </button>
          </div>
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Vol</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compagnie</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Départ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Places</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {flights.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{f.flight_number}</td>
                    <td className="px-4 py-3 text-sm">{f.Airline?.name}</td>
                    <td className="px-4 py-3 text-sm">{f.departureAirport?.iata_code} → {f.arrivalAirport?.iata_code}</td>
                    <td className="px-4 py-3 text-sm">{formatDateTime(f.departure_at)}</td>
                    <td className="px-4 py-3 text-sm">{formatPrice(f.price)}</td>
                    <td className="px-4 py-3 text-sm">{f.available_seats}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(f.status)}`}>
                        {getStatusLabel(f.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right space-x-2">
                      <button onClick={() => openModal('flight', f)} className="text-primary-600 hover:underline">Modifier</button>
                      <button onClick={() => handleDelete('flight', f.id)} className="text-red-600 hover:underline">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Airports */}
      {tab === 'airports' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Gestion des aéroports</h2>
            <button onClick={() => openModal('airport')} className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
              Ajouter un aéroport
            </button>
          </div>
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code IATA</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pays</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {airports.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono font-bold">{a.iata_code}</td>
                    <td className="px-4 py-3 text-sm">{a.name}</td>
                    <td className="px-4 py-3 text-sm">{a.city}</td>
                    <td className="px-4 py-3 text-sm">{a.country}</td>
                    <td className="px-4 py-3 text-sm text-right space-x-2">
                      <button onClick={() => openModal('airport', a)} className="text-primary-600 hover:underline">Modifier</button>
                      <button onClick={() => handleDelete('airport', a.id)} className="text-red-600 hover:underline">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Airlines */}
      {tab === 'airlines' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Gestion des compagnies</h2>
            <button onClick={() => openModal('airline')} className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
              Ajouter une compagnie
            </button>
          </div>
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {airlines.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {a.logo_url ? (
                        <img src={a.logo_url} alt={a.name} className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{a.name}</td>
                    <td className="px-4 py-3 text-sm text-right space-x-2">
                      <button onClick={() => openModal('airline', a)} className="text-primary-600 hover:underline">Modifier</button>
                      <button onClick={() => handleDelete('airline', a.id)} className="text-red-600 hover:underline">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bookings */}
      {tab === 'bookings' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Toutes les réservations</h2>

          {/* Filtres réservations */}
          <div className="flex flex-wrap gap-3 mb-4">
            {['all', 'pending', 'confirmed', 'cancelled'].map((s) => {
              const labels = { all: 'Toutes', pending: 'En attente', confirmed: 'Confirmées', cancelled: 'Annulées' };
              const count = s === 'all' ? bookings.length : bookings.filter((b) => b.status === s).length;
              return (
                <button
                  key={s}
                  onClick={() => setBookingFilter(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    bookingFilter === s
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {labels[s]} ({count})
                </button>
              );
            })}
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vol</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passagers</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{b.id}</td>
                    <td className="px-4 py-3 text-sm">{b.User?.first_name} {b.User?.last_name}</td>
                    <td className="px-4 py-3 text-sm">
                      {b.Flight?.flight_number} ({b.Flight?.departureAirport?.iata_code} → {b.Flight?.arrivalAirport?.iata_code})
                    </td>
                    <td className="px-4 py-3 text-sm">{b.Passengers?.length || 0}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatPrice(b.total_price)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(b.status)}`}>
                        {getStatusLabel(b.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDateTime(b.created_at)}</td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500 text-sm">
                      Aucune réservation trouvée pour ce filtre.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
              {modal.entity ? 'Modifier' : 'Ajouter'}{' '}
              {modal.type === 'flight' ? 'un vol' : modal.type === 'airport' ? 'un aéroport' : 'une compagnie'}
            </h2>

            <div className="space-y-4">
              {modal.type === 'flight' && (
                <>
                  <input name="flight_number" placeholder="Numéro de vol" value={formData.flight_number || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  <select name="airline_id" value={formData.airline_id || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">Compagnie</option>
                    {airlines.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                  <select name="departure_airport_id" value={formData.departure_airport_id || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">Aéroport de départ</option>
                    {airports.map((a) => <option key={a.id} value={a.id}>{a.city} ({a.iata_code})</option>)}
                  </select>
                  <select name="arrival_airport_id" value={formData.arrival_airport_id || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">Aéroport d'arrivée</option>
                    {airports.map((a) => <option key={a.id} value={a.id}>{a.city} ({a.iata_code})</option>)}
                  </select>
                  <input type="datetime-local" name="departure_at" value={formData.departure_at ? new Date(formData.departure_at).toISOString().slice(0, 16) : ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  <input type="datetime-local" name="arrival_at" value={formData.arrival_at ? new Date(formData.arrival_at).toISOString().slice(0, 16) : ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  <input type="number" name="price" placeholder="Prix (EUR)" value={formData.price || ''} onChange={handleFormChange} step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  <input type="number" name="available_seats" placeholder="Places disponibles" value={formData.available_seats || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  <input type="number" name="total_seats" placeholder="Total places" value={formData.total_seats || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  <select name="status" value={formData.status || 'scheduled'} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="scheduled">Programmé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </>
              )}

              {modal.type === 'airport' && (
                <>
                  <input name="name" placeholder="Nom de l'aéroport" value={formData.name || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  <input name="iata_code" placeholder="Code IATA (3 lettres)" value={formData.iata_code || ''} onChange={handleFormChange} maxLength={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono uppercase" />
                  <input name="city" placeholder="Ville" value={formData.city || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  <input name="country" placeholder="Pays" value={formData.country || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </>
              )}

              {modal.type === 'airline' && (
                <>
                  <input name="name" placeholder="Nom de la compagnie" value={formData.name || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  <input name="logo_url" placeholder="URL du logo" value={formData.logo_url || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                Enregistrer
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
