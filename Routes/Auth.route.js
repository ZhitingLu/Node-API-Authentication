const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/Auth.Controlers')

// http://localhost:5000/auth/register
// http://localhost:5000/auth/login
// http://localhost:5000/auth/logout
// http://localhost:5000/auth/refresh-token

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.post('/refresh-token', AuthController.refreshToken);

router.delete('/logout', AuthController.logout);

module.exports = router;
