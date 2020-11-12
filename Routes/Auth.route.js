const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../Models/User.model');
const { authSchema } = require('../helpers/validation_schema');
const { signAccessToken, signRefreshToken } = require('../helpers/jwt.helper');

// http://localhost:5000/auth/register
// http://localhost:5000/auth/login
// http://localhost:5000/auth/logout
// http://localhost:5000/auth/refresh-token

router.post('/register', async (req, res, next) => {
    try {
        // const { email, password } = req.body; 
        // if (!email || !password) {
        //    throw createError.BadRequest('Email or password is missing');
        // };
        // the line below validates the req.body 
        const result = await authSchema.validateAsync(req.body); // validation the whole req.body
        // console.log(result);

        // const doesExist = await User.findOne({ email: email })
        // if (doesExist) throw createError.Conflict(`${email} is already been registered!`);
        const doesExist = await User.findOne({ email: result.email }) // here we change from email to result.email after validating
        if (doesExist) throw createError.Conflict(`${result.email} is already been registered!`); // same here
        
        // const user = new User({ email, password });
        const user = new User(result); // here we can simply use result as it contains the whole req.body : {email, password}

        //saving a user
        const savedUser = await user.save();
        //res.send(savedUser);

        const accessToken = await signAccessToken(savedUser.id); // using await because signAccessToken function is returning a promise
        const refreshToken = await signRefreshToken(savedUser.id);

        //res.send(accessToken);
        res.send({accessToken, refreshToken}); // this way we don't just send back the access token but a json response

    } catch (error) {
        if (error.isJoi === true) error.status = 422; // unprocessable entity error: the sever understands the content type of the entity but is unable to process it
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try{
        const result = await authSchema.validateAsync(req.body); // validate user schema

        const user = await User.findOne({ email: result.email }); // match user email
        if (!user) throw createError.NotFound("User not registered");

        const isMatch = await user.isValidPassword(result.password); // match the password
        if(!isMatch) throw createError.Unauthorized('Username/password not valid');

        // a verified user wants to login, so we create an access token for this user to access a protected route
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);


        res.send({ accessToken, refreshToken });

    } catch(error) {
        if (error.isJoi === true) {
        return next(createError.BadRequest("Invalid Username/Password"));
        };
        next(error);
    }
});

router.post('/refresh-token', async (req, res, next) => {
    res.send("refresh-token route");
});

router.delete('/logout', async (req, res, next) => {
    res.send("logout route");
});

module.exports = router;
