/*==============================================================================
getweather.js - Retireves the weather and parses the data into a supplied 
template, outputting a text file suitable for processing through a 
text-to-speech engine.

getYahooWeather: Retrieves weather from http://www.yahoo.com using "YQL" 
(Yahoo Query Language)

getHTTPSWeather: Retrieves weather from any web API that supplies a JSON file 
via the HTTPS protocol. 

Author: Dennis J Kurlinski

Dependancies: :)
--------------------------------------------------------------------------------  
YQL (>> npm install yql)

Notes
--------------------------------------------------------------------------------
(*)woeids (or 'Where on Earth IDs') are used by the Yahoo API to target
the forecast of a specific location. To find the woeid for your location
reference: http://woeid.rosselliot.co.nz/

(*)Templates: This module will replace text wrapped in square brackets with the 
equivilent JSON data (i.e. [wind.speed] = the current numeric wind speed) See 
the Docs\weather.json file for reference. 

==============================================================================*/

// Required Modules //
var utils = require ("./utils");

module.exports.getYahooWeather = getYahooWeather;
module.exports.getHTTPSWeather = getHTTPSWeather;

function getYahooWeather(woeid, template, output, callback) {
	var yql = require("yql"); // this module interfaces with YQL

	var query = new yql("select * from weather.forecast where woeid = " + woeid);
	query.exec(function(err, data) {
		writeWeather(addYahooLocalVariables(data.query.results.channel),
			template,
			output,
			function(err, data) {
				callback(err, data);
			});
	});

}

function getHTTPSWeather(host, url, template, output, done) {
	var https = require("https");

	var req = {
		host: host,
		path: url,
		port: 443,
		method: "GET"
	};

	var res = function(response) {

		var str = "";

		response.on("data", function(chunk) {
			str += chunk;
		});

		response.on("end", function() {

			var i = {
				"payload": JSON.parse(str),
				"headers": response.headers
			};

			if (response.statusCode == "200") {
				writeWeather(addHTTPSLocalVariables(i.payload),
					template,
					output,
					function(err, object) {
						done(err, object);
					});
			} else {
				utils.toScreen("*******HTTP Error: " + response.statusCode);
				done(response.statusCode, i);
			}

		});

	};

	https.request(req, res).end();
}

function writeWeather(weather, template, output, callback) {
	var fs = require("fs");

	fs.readFile(template, "utf8", function(err, text) {
		var keywords = text.match(/\[(.*?)\]/g);
		for (var i in keywords) {
			var keyword = keywords[i].toString().substr(1, keywords[i].length - 2);
			text = text.replace(keywords[i], utils.getProperty(weather, keyword));
		}

		fs.writeFile(output, text, function(err) {
			callback(err, text);
		});

	});

}

var addHTTPSLocalVariables = function(https_weather) {

	https_weather["local"] = utils.addLocalVariable();

	//Add custom data to the HTTPS local object here:
	var roundDownWhole = [
		"temperature",
		"temperatureMin",
		"temperatureMax",
		"apparentTemperature"
	];

	function iterate(obj) {
		for (var property in obj) {
			if (obj.hasOwnProperty(property)) {
				if (typeof obj[property] == "object") {
					iterate(obj[property]);
				} else {
					if (roundDownWhole.contains(property)) {
						obj[property] = Math.round(obj[property]);
					}
				}
			}
		}

		return obj;
	}

	return iterate(https_weather);
};

var addYahooLocalVariables = function(yahoo_weather) {

	yahoo_weather["local"] = utils.addLocalVariable();

	//Add custom data to the Yahoo local object here:
	var rising = ["falling", "climbing"];
	yahoo_weather.local.barStatus = rising[yahoo_weather.atmosphere.rising];
	yahoo_weather.local.windDirection = 
		utils.getDirection(yahoo_weather.wind.direction);

	return yahoo_weather;

};

Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
};