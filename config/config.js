require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  },

  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  }
};