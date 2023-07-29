require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const db = require('./db');
const { Pool } = require('pg');


// Middleware to parse incoming JSON data
app.use(express.json());

// Routes
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const checklistRoute = require('./routes/checklist');
const checklistItemRoute = require('./routes/checklist_item');

app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/checklist', checklistRoute);
app.use('/api/checklist', checklistItemRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
