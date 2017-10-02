'use strict';
// Dependencies
let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');

const PORT = process.env.PORT || 8080;

// creates an instance of the Express class
let app = express();

/* Use the API router for REST endpoints, separate from the webserver routing */
let api = require('./API');
app.use('/api', api);

app.use(morgan('combined'));

// Specifies what folders have static files the server must read
app.use(express.static('images'));
app.use(express.static('scripts'));
app.use(express.static('css'));
app.use(express.static('html'));
app.use(express.static('routes'));
app.use(express.static('services'));
app.use(express.static('node_modules'));

// TELLS SERVER HOW TO READ INCOMING JSON OR URL DATA
app.use(bodyParser.urlencoded({
	extended: true,
}));

app.use(bodyParser.json());

// Tells the terminal the node has been created at a given port number
app.listen(PORT, function() {
  console.log('Listening on port ' + PORT);
});
