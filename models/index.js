const dbConfig = require("./../config/config.json");
const { Sequelize } = require("sequelize");
const initModels = require("./init-models");

// Determine the environment (development, production, etc.)
const env = process.env.NODE_ENV || "development";
const dbConf = dbConfig[env];

// Initialize Sequelize with the database configuration
const sequelize = new Sequelize(
  dbConf.database,
  dbConf.username,
  dbConf.password,
  {
    host: dbConf.host,
    dialect: dbConf.dialect,
    define: {
      timestamps: false,
    },
    pool: {
      max: dbConf.pool.max,
      min: dbConf.pool.min,
      acquire: dbConf.pool.acquire,
      idle: dbConf.pool.idle,
    },
  }
);

// Check the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// Initialize models and define associations
const models = initModels(sequelize);

// Define associations dynamically
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Function to sync all models with the database
const syncAllModels = async () => {
  try {
    await sequelize.sync({ alter: true }); // Use force: true for dropping and recreating tables
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to synchronize models:", error);
  }
};

// Export the necessary modules
module.exports = { models, sequelize, syncAllModels };
//syncAllModels();

// Example usage of syncAllModels
// To use this in another file, you would require this module and call syncAllModels():
// const { syncAllModels } = require('./path/to/this/file');
