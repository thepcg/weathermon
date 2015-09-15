/*===============================================================================
getweather.js - Retireves the weather and parses the data into a supplied 
template, outputting a text file suitable for processing through a text-to-speech 
engine.

getYahooWeather: Retrieves weather from http://www.yahoo.com using "YQL" 
(Yahoo Query Language)

getHTTPSWeather: Retrieves weather from any web API that supplies a JSON file via
the HTTPS protocol. 

Author: Dennis J Kurlinski

Dependancies:
---------------------------------------------------------------------------------  
YQL (>> npm install yql)

Notes
---------------------------------------------------------------------------------
(*)woeids (or 'Where on Earth IDs') are used by the Yahoo API to target
the forecast of a specific location. To find the woeid for your location
reference: http://woeid.rosselliot.co.nz/

(*)Templates: This module will replace text wrapped in square brackets with the 
equivilent JSON data (i.e. [wind.speed] = the current numeric wind speed) See the
Docs\weather.json file for reference. 

===============================================================================*/

// Required Modules //

module.exports.getYahooWeather = getYahooWeather;
module.exports.getHTTPSWeather = getHTTPSWeather;

function getYahooWeather(woeid, template, output, callback) {
	var yql = require("yql"); // this module interfaces with YQL

	var query = new yql("select * from weather.forecast where woeid = " + woeid);
	query.exec(function(err, data) {
		writeWeather(addYahooLocalVariables(data.query.results.channel), template, output, function(err, data) {
			callback(err, data);
		});
	});

};

function getHTTPSWeather(host, url, template, output, done) {
	var https = require("https");

	var req = {
		host: host,
		path: url,
		port: 443,
		method: "GET"
	};

	res = function(response) {

		var str = '';

		response.on('data', function(chunk) {
			str += chunk;
		});

		response.on('end', function() {

			var i = {
				"payload": JSON.parse(str),
				"headers": response.headers
			};

			if (response.statusCode == "200") {
				writeWeather(addHTTPSLocalVariables(i.payload), template, output, function(err, data) {
					done(err, data);
				});
				done(null, i);
			} else {
				console.log('HTTP Error: ' + response.statusCode);
				done(response.statusCode, i);
			}

		});

	};

	https.request(req, res).end();
};

function writeWeather(weather, template, output, callback) {
	var fs = require("fs"); // this module handles I/O to disk

	fs.writeFile(__dirname + "/weather.json", JSON.stringify(weather), function(err) {});

	fs.readFile(template, "utf8", function(err, text) {
		var keywords = text.match(/\[(.*?)\]/g);
		for (i in keywords) {
			var keyword = keywords[i].toString().substr(1, keywords[i].length - 2);
			var text = text.replace(keywords[i], getProperty(weather, keyword));
		}

		fs.writeFile(output, text, function(err) {
			fs.writeFile(__dirname + "/weather1.json", JSON.stringify(weather), function(err) {});
			callback(err, text);
		});

	});

};

var addHTTPSLocalVariables = function(object) {
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var rising = ["falling", "climbing"];
	var now = new Date();
	var roundDownWhole = ["temperature", "temperatureMin", "temperatureMax", "apparentTemperature"];

	//To add custom placeholders add them here.
	object["local"] = {
		"weekday": [],
		"month": months[now.getMonth()],
		"date": ordinal(now.getDate()),
	};

	for (i = 0; i < 7; i++) {
		day = now.getDay() + i;
		if (day > 6) {
			day = day - 7;
		}
		object.local.weekday[i] = days[day];
	}

	function iterate(object) {
		for (var property in object) {
			if (object.hasOwnProperty(property)) {
				if (typeof object[property] == "object") {
					iterate(object[property]);
				} else {
					if (roundDownWhole.contains(object.property)) {
						object.property = Math.round(object.property)
					}
				}
			}
		}
	};


	return object;

};

var addYahooLocalVariables = function(object) {

	object["local"] = addLocalVariable();

	//Add custom data to the Yahoo local object here:
	var rising = ["falling", "climbing"];
	object.local.barStatus = rising[object.atmosphere.rising]
	object.local.windDirection = getCardinal(object.wind.direction)

	return object;

};

var addLocalVariable = function() {
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var now = new Date();
	var hours = now.getHours();
	if (hours > 12) {
		hours = hours - 12;
		ampm = "PM"
	} else {
		ampm = "AM"
	}
	var minutes = now.getMinutes();
	var seconds = now.getSeconds();
	var time = hours + ":" + minutes + " " + ampm;
	object = {
		"time": time,
		"weekday": [],
		"month": months[now.getMonth()],
		"date": ordinal(now.getDate()),
		"year": now.getFullYear()
	};

	for (i = 0; i < 7; i++) {
		day = now.getDay() + i;
		if (day > 6) {
			day = day - 7;
		}
		object.weekday[i] = days[day];
	}

	return object;
};

function ordinal(i) {
	var j = i % 10,
		k = i % 100;
	if (j == 1 && k != 11) {
		return i + "st";
	}
	if (j == 2 && k != 12) {
		return i + "nd";
	}
	if (j == 3 && k != 13) {
		return i + "rd";
	}
	return i + "th";
};

function getCardinal(angle) {
	//easy to customize by changing the number of directions you have 
	var directions = 8;

	var degree = 360 / directions;
	angle = angle + degree / 2;

	if (angle >= 0 * degree && angle < 1 * degree)
		return "North";
	if (angle >= 1 * degree && angle < 2 * degree)
		return "North East";
	if (angle >= 2 * degree && angle < 3 * degree)
		return "East";
	if (angle >= 3 * degree && angle < 4 * degree)
		return "South East";
	if (angle >= 4 * degree && angle < 5 * degree)
		return "South";
	if (angle >= 5 * degree && angle < 6 * degree)
		return "South West";
	if (angle >= 6 * degree && angle < 7 * degree)
		return "West";
	if (angle >= 7 * degree && angle < 8 * degree)
		return "North West";
	//Should never happen: 
	return "North";
};

var getProperty = function(obj, prop) {
	var parts = prop.split('.'),
		last = parts.pop(),
		l = parts.length,
		i = 1,
		current = parts[0];

	while ((obj = obj[current]) && i < l) {
		current = parts[i];
		i++;
	}

	if (obj) {
		return obj[last];
	}
};

Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}