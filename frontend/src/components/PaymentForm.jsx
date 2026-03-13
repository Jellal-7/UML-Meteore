import { useState } from 'react';

export default function PaymentForm({ onPayment, loading }) {
  const [form, setForm] = useState({
    card_holder: '',
    card_number: '',
    card_expiry: '',
    card_cvv: '',
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'card_number') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    if (name === 'card_expiry') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
    }
    if (name === 'card_cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPayment({
      ...form,
      card_number: form.card_number.replace(/\s/g, ''),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titulaire de la carte</label>
        <input
          type="text"
          name="card_holder"
          value={form.card_holder}
          onChange={handleChange}
          required
          placeholder="Jean Dupont"
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
        <input
          type="text"
          name="card_number"
          value={form.card_number}
          onChange={handleChange}
          required
          placeholder="1234 5678 9012 3456"
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiration</label>
          <input
            type="text"
            name="card_expiry"
            value={form.card_expiry}
            onChange={handleChange}
            required
            placeholder="MM/AA"
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
          <input
            type="text"
            name="card_cvv"
            value={form.card_cvv}
            onChange={handleChange}
            required
            placeholder="123"
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        {loading ? 'Traitement en cours...' : 'Payer maintenant'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Paiement simulé — aucune transaction réelle ne sera effectuée.
      </p>
    </form>
  );
}
