/*
 * Assignment 1
 * Mike
*/

/* THE SERVER */

// Import dependencies
const http = require('http');
const url = require('url');

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

	// Response
	req.on('end', function() {
		
		// Figure out the chosen handlers from the request path
		var chosenRouteHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
		console.log(chosenRouteHandler);
		
		// Create an object to send all the relevant parsed data from the http request to the router
		var data = {
			'trimmedPath' : trimmedPath,
			'method' : method,
			'headers' : headers
		}

		// Route the request to the chosen route handler
		chosenRouteHandler(data, function(statusCode, payload) {
			
			// Route status code or default
			statusCode = typeof(statusCode) == 'number' ? statusCode : 406;
			
			// Payload or empty object
			payload = typeof(payload) == 'object' ? payload : {};
			var payloadString = JSON.stringify(payload);

			// Return the response
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

/* ROUTING */

// Route handlers

var routeHandlers = {};

// Hello route
routeHandlers.hello = function(data, callback) {
	//    -->status           -->payload
	callback(200,{'message' : 'Welcome to the API'});
};

// 404 route
routeHandlers.notFound = function(data, callback) {
	callback(400);
};


// The router
var router = {
	'hello' : routeHandlers.hello
}