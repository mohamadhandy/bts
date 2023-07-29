const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    // find username
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    // invalid user
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // verify password
    const isPasswordMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // create token jwt
    const tokenPayload = { userId: user.rows[0].id, username: user.rows[0].username };
    const secretKey = process.env.SECRET_KEY;
    const options = { expiresIn: '1h' };
    const token = jwt.sign(tokenPayload, secretKey, options);

    res.status(200).json({ message: 'Success login', data: { token } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
