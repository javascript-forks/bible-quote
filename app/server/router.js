var _ = require('./vendor/underscore-min');


var handlers = [
	require('./api/reflect'),
	require('./api/bq'),
];

var api = {};
for (var i = 0; i < handlers.length; i++) {
	api[handlers[i].name] = handlers[i].local;
}

module.exports = function(app) {
	// Create the remote API handlers with the corresponding paths and methods.
	console.log("ROUTER: Creating remote handlers");
	for (var i = 0; i < handlers.length; i++) {
		var name = handlers[i].name;	// E.g. user
		var remote = handlers[i].remote;	// Array
		for (var j = 0; j < remote.length; j++) {
			var path = '/api/' + name + '/' + remote[j].name;
			var method = remote[j].method;	
			console.log("ROUTER: registering " + method + ": " + path);
			app[method](path, remote[j].handler);
		}
	}		

	app.get('/', function(req, res) {
		console.log("GET / {" + JSON.stringify(req.param) + "}");//
		var bibles = require('./lib/bibles');
		res.redirect('./docs/classes/bible-quote.html');
	});
};