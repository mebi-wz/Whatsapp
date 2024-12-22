const express = require('express');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/botRoutes');
const bot = require('./bot'); // Import bot to keep it running

const app = express();
const PORT = process.env.PORT || 3000;
bot;
// Middleware
app.use(bodyParser.json());

// API Routes
app.use('/api', contactRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
