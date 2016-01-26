var express = require('express');
var http = require('http');
var app = express();

app.configure(function(){
	app.set('port', 8080);
	app.set('views', __dirname + '/app/server/views');
//	app.set('view engine', 'ejs');
	app.locals.pretty = true;
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
//	app.use(express.cookieParser());
//	app.use(express.session({ secret: 'forgodsolovedtheworld' }));
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/app/public'));
	app.use(express.favicon(__dirname + '/app/public/images/favicon.ico'));
});

// app.configure('development', function(){
// 	app.use(express.errorHandler());
// });

require('./app/server/router')(app);


app.use(function(err, req, res, next) {
	console.error(err);
	res.send(err.status, err);
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("BibleQuote server listening on port " + app.get('port'));
});
