require('dotenv').config();

const app = require('./app');
const { sequelize, User, Airline, Airport, Flight } = require('./models');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 3001;

const seedIfEmpty = async () => {
  const userCount = await User.count();
  if (userCount > 0) {
    console.log('Base de données déjà peuplée, seed ignoré.');
    return;
  }

  console.log('Base de données vide, lancement du seed...');

  const adminHash = await bcrypt.hash('admin123', 12);
  const userHash = await bcrypt.hash('user123', 12);

  await User.bulkCreate([
    { first_name: 'Admin', last_name: 'Météore', email: 'admin@meteore.fr', password_hash: adminHash, role: 'admin' },
    { first_name: 'Jean', last_name: 'Dupont', email: 'jean.dupont@email.com', password_hash: userHash, role: 'user' },
  ]);

  const airlines = await Airline.bulkCreate([
    { name: 'Air France', logo_url: 'https://logo.clearbit.com/airfrance.com' },
    { name: 'British Airways', logo_url: 'https://logo.clearbit.com/britishairways.com' },
    { name: 'Emirates', logo_url: 'https://logo.clearbit.com/emirates.com' },
    { name: 'Lufthansa', logo_url: 'https://logo.clearbit.com/lufthansa.com' },
  ]);

  const airports = await Airport.bulkCreate([
    { name: 'Paris-Charles de Gaulle', iata_code: 'CDG', city: 'Paris', country: 'France' },
    { name: 'Paris-Orly', iata_code: 'ORY', city: 'Paris', country: 'France' },
    { name: 'John F. Kennedy International', iata_code: 'JFK', city: 'New York', country: 'États-Unis' },
    { name: 'London Heathrow', iata_code: 'LHR', city: 'Londres', country: 'Royaume-Uni' },
    { name: 'Dubai International', iata_code: 'DXB', city: 'Dubaï', country: 'Émirats arabes unis' },
    { name: 'Tokyo Narita', iata_code: 'NRT', city: 'Tokyo', country: 'Japon' },
    { name: 'Barcelona El Prat', iata_code: 'BCN', city: 'Barcelone', country: 'Espagne' },
    { name: 'Roma Fiumicino', iata_code: 'FCO', city: 'Rome', country: 'Italie' },
  ]);

  const airportMap = {};
  airports.forEach((a) => { airportMap[a.iata_code] = a.id; });
  const airlineMap = {};
  airlines.forEach((a) => { airlineMap[a.name] = a.id; });

  const now = new Date();
  const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
  const addHours = (d, h) => { const r = new Date(d); r.setHours(r.getHours() + h); return r; };

  await Flight.bulkCreate([
    { flight_number: 'AF001', airline_id: airlineMap['Air France'], departure_airport_id: airportMap['CDG'], arrival_airport_id: airportMap['JFK'], departure_at: addDays(now, 7), arrival_at: addHours(addDays(now, 7), 9), price: 450.00, available_seats: 150, total_seats: 180, status: 'scheduled' },
    { flight_number: 'AF002', airline_id: airlineMap['Air France'], departure_airport_id: airportMap['JFK'], arrival_airport_id: airportMap['CDG'], departure_at: addDays(now, 14), arrival_at: addHours(addDays(now, 14), 8), price: 480.00, available_seats: 120, total_seats: 180, status: 'scheduled' },
    { flight_number: 'BA303', airline_id: airlineMap['British Airways'], departure_airport_id: airportMap['LHR'], arrival_airport_id: airportMap['CDG'], departure_at: addDays(now, 3), arrival_at: addHours(addDays(now, 3), 1), price: 120.00, available_seats: 90, total_seats: 150, status: 'scheduled' },
    { flight_number: 'EK073', airline_id: airlineMap['Emirates'], departure_airport_id: airportMap['CDG'], arrival_airport_id: airportMap['DXB'], departure_at: addDays(now, 5), arrival_at: addHours(addDays(now, 5), 7), price: 380.00, available_seats: 200, total_seats: 300, status: 'scheduled' },
    { flight_number: 'LH456', airline_id: airlineMap['Lufthansa'], departure_airport_id: airportMap['CDG'], arrival_airport_id: airportMap['NRT'], departure_at: addDays(now, 10), arrival_at: addHours(addDays(now, 10), 12), price: 650.00, available_seats: 100, total_seats: 200, status: 'scheduled' },
    { flight_number: 'AF010', airline_id: airlineMap['Air France'], departure_airport_id: airportMap['CDG'], arrival_airport_id: airportMap['BCN'], departure_at: addDays(now, 2), arrival_at: addHours(addDays(now, 2), 2), price: 89.00, available_seats: 60, total_seats: 120, status: 'scheduled' },
    { flight_number: 'AF012', airline_id: airlineMap['Air France'], departure_airport_id: airportMap['CDG'], arrival_airport_id: airportMap['FCO'], departure_at: addDays(now, 4), arrival_at: addHours(addDays(now, 4), 2), price: 110.00, available_seats: 75, total_seats: 120, status: 'scheduled' },
    { flight_number: 'BA505', airline_id: airlineMap['British Airways'], departure_airport_id: airportMap['LHR'], arrival_airport_id: airportMap['JFK'], departure_at: addDays(now, 6), arrival_at: addHours(addDays(now, 6), 8), price: 520.00, available_seats: 140, total_seats: 200, status: 'scheduled' },
    { flight_number: 'EK201', airline_id: airlineMap['Emirates'], departure_airport_id: airportMap['DXB'], arrival_airport_id: airportMap['NRT'], departure_at: addDays(now, 8), arrival_at: addHours(addDays(now, 8), 10), price: 700.00, available_seats: 250, total_seats: 350, status: 'scheduled' },
    { flight_number: 'LH789', airline_id: airlineMap['Lufthansa'], departure_airport_id: airportMap['FCO'], arrival_airport_id: airportMap['CDG'], departure_at: addDays(now, 9), arrival_at: addHours(addDays(now, 9), 2), price: 95.00, available_seats: 80, total_seats: 120, status: 'scheduled' },
    { flight_number: 'AF020', airline_id: airlineMap['Air France'], departure_airport_id: airportMap['ORY'], arrival_airport_id: airportMap['BCN'], departure_at: addDays(now, 3), arrival_at: addHours(addDays(now, 3), 2), price: 75.00, available_seats: 50, total_seats: 90, status: 'scheduled' },
    { flight_number: 'BA100', airline_id: airlineMap['British Airways'], departure_airport_id: airportMap['CDG'], arrival_airport_id: airportMap['LHR'], departure_at: addDays(now, 1), arrival_at: addHours(addDays(now, 1), 1), price: 105.00, available_seats: 40, total_seats: 150, status: 'scheduled' },
  ]);

  console.log('Seed terminé : 2 utilisateurs, 8 aéroports, 4 compagnies, 12 vols.');
};

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie.');

    await sequelize.sync({ alter: true });
    console.log('Modèles synchronisés avec la base de données.');

    await seedIfEmpty();

    app.listen(PORT, () => {
      console.log(`Serveur Météore démarré sur le port ${PORT}`);
    });
  } catch (err) {
    console.error('Impossible de démarrer le serveur :', err);
    process.exit(1);
  }
};

start();
