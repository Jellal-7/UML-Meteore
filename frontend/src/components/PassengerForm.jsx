export default function PassengerForm({ index, passenger, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(index, { ...passenger, [name]: value });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200">
      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Passager {index + 1}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Prénom</label>
          <input
            type="text"
            name="first_name"
            value={passenger.first_name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Nom</label>
          <input
            type="text"
            name="last_name"
            value={passenger.last_name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Date de naissance</label>
          <input
            type="date"
            name="birth_date"
            value={passenger.birth_date}
            onChange={handleChange}
            required
            max={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">N° Passeport</label>
          <input
            type="text"
            name="passport_number"
            value={passenger.passport_number}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
