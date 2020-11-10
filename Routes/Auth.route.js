const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../Models/User.model');
const { authSchema } = require('../helpers/validation_schema');
const { signAccessToken } = require('../helpers/jwt.helper');

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
        //res.send(accessToken);
        res.send({accessToken}); // this way we don't just send back the access token but a json response

    } catch (error) {
        if (error.isJoi === true) error.status = 422; // unprocessable entity error: the sever understands the content type of the entity but is unable to process it
        next(error);
    }
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
