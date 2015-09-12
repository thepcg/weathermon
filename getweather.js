/*===============================================================================
getweather.js - Retrieves weather from http://www.yahoo.com using "YQL" 
(Yahoo Query Language) and parses the data into a supplied template, outputting 
a text file suitable for processing through a text-to-speech engine. 

Author: Dennis J Kurlinski

Dependancies:
---------------------------------------------------------------------------------  
YQL (> npm install yql)

Usage:
--------------------------------------------------------------------------------- 
var getweather = require("./getweather"); //includes module
var location = "12776596"; //set your 'woeid'
getweather.write(location, template location, path to output, function(err) {}); 

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
var yql = require("yql"); // this module interfaces with YQL
var fs = require("fs"); // this module handles I/O to disk

module.exports.write = write;

function write(woeid, template, output, callback) {

	// Functions

	var addLocalVariables = function(object) {
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var now = new Date();

		//To add custom placeholders add them here.
		object["local"] = {
			"weekday": days[now.getDay()],
			"month": months[now.getMonth()],
			"date": ordinal(now.getDate())
		};
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

	var query = new yql("select * from weather.forecast where woeid = " + woeid);

	query.exec(function(err, data) {
		weather = data.query.results.channel;
		addLocalVariables(weather);
		fs.readFile(template, "utf8", function(err, text) {
			keywords = text.match(/\[(.*?)\]/g);
			for (i in keywords) {
				keyword = keywords[i].substr(1, keywords[i].length - 2);
				text = text.replace(keywords[i], getProperty(weather, keyword));
			}

			fs.writeFile(output, text, function(err) {
				callback(err, text);
			});

		});
	});
};