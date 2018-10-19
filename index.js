/*
 * Assignment 1
 * Mike
*/

/* THE SERVER */

// Import dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// Define a server and behaviours
var server = http.createServer(function(req,res) {
	
	// Parse the incoming url
	var parsedUrl = url.parse(req.url, true);

	// Get the path and give it a neat trim!
	var trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

	// Get the http method
	var method = req.method.toLowerCase();
	// Get headers as an object
	var headers = req.headers;
	// Get the payload
	var decoder = new StringDecoder('utf-8');
	var buffer = '';

	// When request 'data' event is triggered
	// Note: the on.data event must be called whether used or not
	req.on('data', function(data) {
		buffer+= decoder.write(data);
	});

	// When request 'end' event is triggered
	req.on('end', function() {

		console.log('Incoming payload: ' + buffer);
		
		// Figure out the chosen handlers from the request path
		var chosenRouteHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : routeHandlers.notFound;
		
		// Create an object to send all the relevant parsed data from the http request to the router
		var data = {
			'trimmedPath' : trimmedPath,
			'method' : method,
			'headers' : headers
		}

		// Route the request to the chosen route handler
		chosenRouteHandler(data, function(statusCode, payload) {
			
			// Route status code or default
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			
			// Set up the return payload or an empty object if none
			payload = typeof(payload) == 'object' ? payload : {};
			payload.incomingMessage = buffer;
			var payloadString = JSON.stringify(payload);

			// Return the response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
			console.log('Returning: ', statusCode, payloadString);
		});
	});

});

// Start the server listening
server.listen(3000, function() {
	console.log("Listening on port 3000...")
});

/* ROUTES */

/* ROUTE HANDLERS */
var routeHandlers = {};

// Hello route handler
routeHandlers.hello = function(data, callback) {
	//    -->status           -->payload
	callback(200,{'message' : 'Welcome to the API, try our /coffee endpoint'});
};

// Coffee route handler
routeHandlers.coffee = function(data, callback) {
	callback(418,{'message' : 'Tea only please!'});
};

// 404 route handler
routeHandlers.notFound = function(data, callback) {
	callback(404);
};


/* ROUTER OBJECT */
var router = {
	'hello' : routeHandlers.hello,
	'coffee': routeHandlers.coffee
}