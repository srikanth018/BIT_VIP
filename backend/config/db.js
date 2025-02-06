const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables from .env file

// Database connection configuration
const sequelize = new Sequelize(
    process.env.DB_NAME,       // Database name
    process.env.DB_USER,       // Database username
    process.env.DB_PASSWORD,   // Database password
    {
        host: process.env.DB_HOST || 'localhost', // Database host
        dialect: 'mysql',                         // Database type (MySQL in this case)
        logging: false                            // Disable logging for cleaner output
    }
    
);

// Test the database connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = sequelize;
