// Makes the async call to load the quote.
var http = require('http');
var https = require('https');
var _ = require('../vendor/underscore-min');

var bibles = require('../lib/bibles');

exports.name = "bible-quote";
/**
The Bible API Aggregate Web Service brings together a number of Bible APIs on the web to offer a comprehensive set of Bibles to quote from. 
It offers REST-based APIs for looking up Bible passages.

Many thanks to the following services: [Biblia.com](http://api.biblia.com/docs/), [Bible Search](http://bibles.org/pages/api), [ESV Bible Web Service](http://www.esvapi.org/api), and [Bible.org](https://labs.bible.org/api_web_service)

@class bible-quote
**/
exports.remote = [ 
	{
		name: 'version.json', 
		method: 'get', 
		/**
		BibleQuote Handler for HTTP GET version.json.

		@method version.json
		@param version {String} One of the Bible ids listed in the {{#crossLink "bible-quote/versions.json:method"}}{{/crossLink}} call.
		@return {Object} JSON object describing the requested Bible version including id, title, copyright, and description.
		@example
			http://noblecall.orthlieb.com/api/bible-quote/version.json/?version=esv
		@example 
			{
				id: "esv",
				title: "English Standard Version",
				copyright: "Copyright 2001 by Crossway, a publishing ministry of Good News Publishers.",
				description: "The ESV Bible (English Standard Version) is an “essentially literal” translation of the Bible in contemporary English. The ESV Bible emphasizes “word-for-word” accuracy, literary excellence, and depth of meaning."
			}
		**/
		handler: function (req, res) {
			console.log('GET VERSION: ' + JSON.stringify(req.query));
			if (!bibles[req.query.version]) {
				res.send(400, "Bible version not valid (" + req.query.version + ")");
				return;
			}

			var version = _.pick(bibles[req.query.version], [ 'id', 'title', 'copyright', 'description' ]);
			res.json(200, version);
		}
	}, {
		name: 'versions.json', 
		method: 'get', 
		/**
		BibleQuote Handler for HTTP GET versions.json.

		@method versions.json
		@return {Object} JSON object containing key value pairs, one for each Bible supported by the API. Each value is an object describing the requested Bible version including id, title, copyright, and description.
		@example
			http://noblecall.orthlieb.com/api/bible-quote/versions.json
		@example 
			{
				"asv": {
					"id": "asv",
					"title": "American Standard Version",
					"copyright": "Public Domain",
					"description": "The ASV has long been regarded by many scholars as the most literal English translation since the King James Version—maybe the most literal translation ever. This has made the translation very popular for careful English Bible study, but not for ease of reading. While the KJV was translated entirely from 'western manuscripts', the ASV 1901 was influenced also by the older 'eastern manuscripts' that form the basis for most of our modern English translations. Because the ASV 1901 is very difficult to find in print, Logos is pleased to be able to preserve and distribute this significant work. This is an excellent choice for comparative English study."
				}, 
				"amp": { ... 
				}, ...
			}
		**/
		handler: function (req, res) {
			console.log('GET VERSIONS: ' + JSON.stringify(req.query));
		    var versions = {};
			_.each(bibles, function (value, key, list) {
				versions[key] = _.pick(value, [ 'id', 'title', 'copyright', 'description' ]);
			});
			res.json(200, versions);
		}
	}, {
		name: 'quote.json', 
		method: 'get', 
		/**
		BibleQuote Handler for HTTP GET quote.json.

		@method quote.json
		@param version {String} One of the Bible ids listed in the {{#crossLink "bible-quote/versions.json:method"}}{{/crossLink}} call.
		@param book {String} A valid book of the Bible.
		@param chapter {Number} A valid chapter in the specified book.
		@param verse {Number} A valid verse in the specified chapter.
		@return {Object} JSON object containing the requested quote.
		@example
			http://noblecall.orthlieb.com/api/bible-quote/quote.json?version=gnt&book=john&chapter=3&verse=16
		@example 
		{
			"version": "gnt",
			"book": "john",
			"chapter": "3",
			"verse": "16",
			"text": "For God loved the world so much that he gave his only Son, so that everyone who believes in him may not die but have eternal life. "
		}		
		**/
		handler: function (req, res) {
			console.log('GET QUOTE: ' + JSON.stringify(req.query));
 
			if (!bibles[req.query.version]) {
				res.send(400, "Bible version not valid (" + req.query.version + ")");
				return;
			}
	
			var bcv = escape(req.query.book + " " + req.query.chapter + ":" + req.query.verse);
	 
			// Two formats, one to munge the book/chapter/verse inline with the URL
			var path = bibles[req.query.version].host + bibles[req.query.version].path;
			path = path.replace(/%auth/, bibles[req.query.version].auth);
			path = path.replace(/%version/, req.query.version.toUpperCase());
			path = path.replace(/%verse/, bcv);
	
			// The other is a series of &key=value params in the query.
			var params = {};
			if (bibles[req.query.version].options) {
				params = bibles[req.query.version].options(req.query.version, bcv);
			}
			var count = 0;
			for (var i in params) {
				path += (count++ ? '&' : '?') + i + "=" + params[i];
			}
 
			var method = bibles[req.query.version].auth ? https : http; 
			var breq = method.get(path, function(bres) {
				var passage = "";
		
				console.log("StatusCode: " + bres.statusCode);
				console.log("Headers: " + JSON.stringify(bres.headers));
		
				// Restore the chunks of data to a single string.
				bres.on('data', function (chunk) { passage += chunk; });
		
				// Process the end event.
				bres.on('end', function () {
					console.log("End received: " + passage);
					if (passage) {
						if (bibles[req.query.version].stripper) {
							passage = bibles[req.query.version].stripper(passage);           
						}
						// Strip duplicate whitespace.
						passage = passage.replace(/\s+/g, " ");
						// Strip white space at beginning and end.
						passage = passage.replace(/^\s+|\s+$/, "");
					}
					console.log("Processed Passage >" + passage + "<");
 
					res.json(200, {
						version: req.query.version,
						book: req.query.book,
						chapter: req.query.chapter,
						verse: req.query.verse,
						text: passage
					}); 
				});
			}).on('error', function (e) {
				console.log("Problem with request: " + e.message);
				res.send(500, "Could not look up passage");
			});
		}
	}
];
