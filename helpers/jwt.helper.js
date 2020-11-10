const JWT = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {
                // name: "Seth",
                // exp: new Date()  Here you have to manipulate the time 
                //iss: "amazing.com",
                // aud: userId,
            };
            const secret = "some secret";
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
