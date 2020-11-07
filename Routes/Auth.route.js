const express = require('express');
const router = express.Router();

// http://localhost:5000/auth/register
// http://localhost:5000/auth/login
// http://localhost:5000/auth/logout
// http://localhost:5000/auth/refresh-token

router.post('/register', async (req, res, next) => {
    res.send("register route");
});

router.post('/login', async (req, res, next) => {
    res.send("login route");
});

router.post('/refresh-token', async (req, res, next) => {
    res.send("refresh-token route");
});

router.delete('/logout', async (req, res, next) => {
    res.send("logout route");
});

module.exports = router;
