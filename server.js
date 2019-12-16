var express = require('express');

var bodyParser = require('body-parser');

var app = express();

const config = require('./config/config');

var router = express.Router();

const path = require('path');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

// Connecting to database
require('./models/db')
require("./models/location.model");
require("./models/user.model");

// Using Bodyparser
app.use(bodyParser.json());

// Controllers 
const locationController = require('./controllers/locationController');
const userController = require('./controllers/userController');

// API routes
app.use('/api/v1/location', locationController, (router));
app.use('/api/v1/user', userController, (router));


module.exports = app;