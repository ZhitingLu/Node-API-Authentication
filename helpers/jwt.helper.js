const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const client = require('./init_redis');  // ro store the refresh token



module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {
                // name: "Seth",
                // exp: new Date()  Here you have to manipulate the time 
                // iss: "amazing.com",
                // aud: userId,
            };
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: "1h",
                issuer: "amazing.com",
                audience: userId,
            };
            JWT.sign(payload, secret, options, (err, token) => {
                // fix an error here: whenever we sign a jwt / access token, there might an error from generating the jwt
                // since it's an internal server error, we shouldn't pass the below error to the client 
                // we should pass an internet error instead 

                // if (err) reject(err)
                if (err) {
                    console.log(err.message);
                    reject(createError.InternalServerError());
                    return;
                };

                resolve(token);
            });
        });
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(createError.Unauthorized());  // verifying if the authorization is present in the headers
        const authHeader = req.headers['authorization']; // header: bearer + access token 
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1]; //actual token
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                // if (err === 'JsonWebTokenError') {
                //    return next(createError.Unauthorized());
                // } else {
                //    return next(createError.Unauthorized(err.message))
                // };
                const message = err.name === 'JsonWebTokenError' ? "Unauthorized" : err.message;
                return next(createError.Unauthorized(message));
            }
            req.payload = payload;
            next();
        })
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {
                // name: "Seth",
                // exp: new Date()  Here you have to manipulate the time 
                // iss: "amazing.com",
                // aud: userId,
            };
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: "1y",
                issuer: "amazing.com",
                audience: userId,
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message);
                    reject(createError.InternalServerError());
                };
               
                // userId as key, token as value. It will expire in one year
                client.SET(userId, token, 'EX', 365*24*60*60, (err, reply) => {
                    if (err) {
                        console.log(err.message)
                        reject(createError.InternalServerError());
                        return;
                    }
                    resolve(token);
                })
            });
        });
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(
                refreshToken, 
                process.env.REFRESH_TOKEN_SECRET, 
                (err, payload) => {
                if (err) return reject(createError.Unauthorized());
                const userId = payload.aud;
                client.GET(userId, (err, result) => {
                    if (err) {
                        console.log(err.message);
                        reject(createError.InternalServerError()); 
                        return;
                    }
                    if (refreshToken === result) return resolve(userId); // result is coming from the key
                    reject(createError.Unauthorized()); 
                })
                // resolve(userId);
            })
        })
    },
};
