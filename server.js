/*=========================================================
weathermon - server.js 

Example usage

Author: Dennis J Kurlinski
=========================================================*/

// Required Modules //
var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var schedule = require('node-schedule');
var getweather = require("./getweather");

toScreen("Starting...");
fs.readFile(__dirname + "/config/config.json", "utf8", function(err, text) {
	if (err === null) {
		toScreen("Loading config...")
		config = JSON.parse(text);
		if (typeof config == "object" && config !== null) {
			for (var x in config.schedules) {
				if (config.schedules.hasOwnProperty(x)) {
					sched = config.schedules[x];

					var rule = new schedule.RecurrenceRule();
					rule.dayOfWeek = sched.days;
					clock = sched["clock"].split(":");
					rule.hour = parseInt(clock[0]);
					rule.minute = parseInt(clock[1]);

					var newSchedule = schedule.scheduleJob(rule, function() {
						request = config.requests[sched.request]
						if (request["type"] == "yahoo") {

							getweather.getYahooWeather(request["location"], request["template"], request["output"], function(err, data) {
								if (err === null) {
									toScreen("Executed request profile: " + request["name"] + " using schedule: " + sched["name"]);
								}
							});
						}

					});
				}
			}

			toScreen("Running...");
		} else {
			console.log("Error: configuration file does not contain a valid object.");
		}
	} else {
		console.log("Error: " + err + " when reading configuration.");
	}
});


var app = express();

app.use(express.static(__dirname + '/config'));
app.use(bodyParser.json());

app.post('/config.json', function(request, response) {
	console.log(request.body); // your JSON
	response.send(request.body); // echo the result back
	fs.writeFile(__dirname + "\\config\\config.json", JSON.stringify(request.body), function(err){console.log(err)});
});

app.listen(process.env.PORT || 8081);
console.log("Configuration page listening on http://127.0.0.1:8081");

function toScreen(str) {
	// Create a date object with the current time
	var now = new Date();

	// Create an array with the current month, day and time
	var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];

	// Create an array with the current hour, minute and second
	var time = [now.getHours(), now.getMinutes(), now.getSeconds()];

	// Determine AM or PM suffix based on the hour
	var suffix = (time[0] < 12) ? "AM" : "PM";

	// Convert hour from military time
	time[0] = (time[0] < 12) ? time[0] : time[0] - 12;

	// If hour is 0, set it to 12
	time[0] = time[0] || 12;

	// If seconds and minutes are less than 10, add a zero
	for (var i = 1; i < 3; i++) {
		if (time[i] < 10) {
			time[i] = "0" + time[i];
		}
	}

	// Return the formatted string
	console.log("[WeatherMon] " + date.join("/") + " " + time.join(":") + " " + suffix + " " + str);
}