const { Sequelize } = require('sequelize');

const isTest = process.env.NODE_ENV === 'test' || process.env.DB_DIALECT === 'sqlite';

let sequelize;

if (isTest) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
} else if (process.env.DATABASE_URL) {
  // URL de connexion cloud (Render PostgreSQL, Railway, etc.)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
    dialectOptions: process.env.DB_SSL === 'false' ? {} : {
      ssl: { require: true, rejectUnauthorized: false },
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'meteore',
    process.env.DB_USER || 'meteore_user',
    process.env.DB_PASSWORD || 'meteore_pass',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      dialect: process.env.DB_DIALECT || 'mysql',
      logging: process.env.NODE_ENV === 'production' ? false : console.log,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

module.exports = sequelize;
