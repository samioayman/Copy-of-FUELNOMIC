require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client } = require('pg'); // Import the postgres client

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database Connection
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => console.log('✅ Connected to Supabase Database successfully!'))
  .catch(err => console.error('❌ Database connection error:', err.stack));

// Test Route
app.get('/', (req, res) => {
  res.json({ message: "Fuelnomic Backend is Running!" });
});

// A route to check DB time (Confirming SQL works)
app.get('/db-test', async (req, res) => {
  try {
    const result = await client.query('SELECT NOW()');
    res.json({ message: "Database is alive", time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});