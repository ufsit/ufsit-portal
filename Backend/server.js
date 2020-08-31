const express = require('express');
require('dotenv').config();

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Promise rejection at: ', p);
	console.log('Reason:', reason);
	throw reason;
});

// Initialize our Express class
const app = express();

// Tells the server how to read incoming json or url data
app.use(express.json());

// Use the API router for REST endpoints, separate from the webserver routing
const router = require('./index');

app.use('/', router);

// Tells the terminal the node has been created at a given port number
app.listen(process.env.PORT, function() {
	console.log('UFSIT Portal now accepting requests at https://portal.ufsit.club/');
});