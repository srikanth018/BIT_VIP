const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const roomRoutes = require('./routes/roomRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());
app.use('/api', roomRoutes);

// Sync Database
sequelize.sync({ alter: true }) // Automatically create/alter tables based on models
    .then(() => console.log('Database synchronized'))
    .catch((err) => console.error('Error synchronizing database:', err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
