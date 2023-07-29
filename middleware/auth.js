const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware verify token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    jwt.verify(bearerToken, process.env.SECRET_KEY, (err, authData) => {
      if (err) {
        res.status(403).json({ message: 'Forbidden' });
      } else {
        // Set verify data token
        req.authData = authData;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = verifyToken;
