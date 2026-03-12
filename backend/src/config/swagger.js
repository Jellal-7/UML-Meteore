const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Météore API',
      version: '1.0.0',
      description: 'API REST de réservation de vols — Projet UML & Fullstack',
      contact: { name: 'Équipe Météore' },
    },
    servers: [
      { url: '/api', description: 'API principale' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            first_name: { type: 'string', example: 'Jean' },
            last_name: { type: 'string', example: 'Dupont' },
            email: { type: 'string', format: 'email', example: 'jean.dupont@email.com' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Flight: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            flight_number: { type: 'string', example: 'AF001' },
            airline_id: { type: 'integer' },
            departure_airport_id: { type: 'integer' },
            arrival_airport_id: { type: 'integer' },
            departure_at: { type: 'string', format: 'date-time' },
            arrival_at: { type: 'string', format: 'date-time' },
            price: { type: 'number', example: 450.0 },
            available_seats: { type: 'integer', example: 150 },
            total_seats: { type: 'integer', example: 180 },
            status: { type: 'string', enum: ['scheduled', 'cancelled'] },
          },
        },
        Airport: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string', example: 'Paris-Charles de Gaulle' },
            iata_code: { type: 'string', example: 'CDG', maxLength: 3 },
            city: { type: 'string', example: 'Paris' },
            country: { type: 'string', example: 'France' },
          },
        },
        Airline: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string', example: 'Air France' },
            logo_url: { type: 'string', example: 'https://logo.clearbit.com/airfrance.com' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            flight_id: { type: 'integer' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled'] },
            total_price: { type: 'number', example: 900.0 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Passenger: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            birth_date: { type: 'string', format: 'date' },
            passport_number: { type: 'string' },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            booking_id: { type: 'integer' },
            amount: { type: 'number' },
            method: { type: 'string', enum: ['card'] },
            status: { type: 'string', enum: ['pending', 'completed', 'failed'] },
            processed_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
