const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./helpers/init_mongodb');

const AuthRoute = require('./Routes/Auth.route');

const app = express();

app.use(morgan('dev'));
// app.use(express.json()); express.json() didn't work
// app.use(express.urlencoded({ extented: true});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));


app.get('/', async(req, res, next) => {
    res.send("Hello");
});

app.use('/auth', AuthRoute);

app.use(async(req, res, next) => {
    // const error = new Error("Not found");
    // error.status = 404;
    // next(error);
    // let's use http-errors middleware:
    next(createError.NotFound());

})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    })
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Sever running on the port ${PORT}`);
});