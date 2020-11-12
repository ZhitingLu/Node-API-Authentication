const JWT = require('jsonwebtoken');
const createError = require('http-errors');
// const {resolve} = require('path');
// require('dotenv').config({ path: `/${__dirname}/.env`});
// require('dotenv');

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {
                // name: "Seth",
                // exp: new Date()  Here you have to manipulate the time 
                //iss: "amazing.com",
                // aud: userId,
            };
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: "1h",
                issuer: "amazing.com",
                audience: userId,
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) reject(err)
                resolve(token);
            });
        });
    }
};
