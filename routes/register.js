const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // check email and username
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Email or username already exists.' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // insert new user
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    // delete field password
    const userWithoutPassword = { id: newUser.rows[0].id, username: newUser.rows[0].username, email: newUser.rows[0].email };

    res.status(201).json({ message: 'Success create user', data: userWithoutPassword });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
