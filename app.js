/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var q = require('q');
var router = require('./routes/router');
var scr = require('./repositories/systemConfigRepository');
var logRepository = require('./repositories/logRepository');


var contextRoot = "/envelope";  //Not set any contextRoot at the moment, but let's make it as easy to config

mongoose.Promise = q.Promise;
var envMongo = scr.getMongoEnv();
var	mongoURL = 'mongodb://' + envMongo.user + 
				":" + envMongo.password + 
				'@' + envMongo.host + 
				':' + envMongo.port + 
				'/' + envMongo.db;



// create a new express server
var app = express();

app.use(function(req, res, next){
    if (req.url.endsWith(".html")){
        logRepository.add(logRepository.ActionType.View, req.url);
    }
    next();
});
// serve the files out of ./public as our main files
app.use(contextRoot, express.static(__dirname + '/public'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : false
}));

router(app, contextRoot);

// app.listen(appEnv.port, '0.0.0.0', function() {
//   // print a message when the server starts listening
//   console.log("server starting on " + appEnv.url);
// });


//from bin/www style
var debug = require('debug')('app:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort('9001');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

mongoose
.connect(mongoURL)
.then(function() {
	console.log('Mongodb connected');
	server.listen(port);
	server.on('error', onError);
	server.on('listening', onListening);
})
.catch(function(err) {
	console.log("Could not connect mongodb with error message "+ err);
});


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	console.log('Listening on ' + bind);
}

