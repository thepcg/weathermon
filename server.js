/*=========================================================
weathermon - server.js 

Entrypoint for the Weathermon app. This file reads the configuration file and
schedules requests based on the data it finds. 

Author: Dennis J Kurlinski
=========================================================*/

// Required Modules //
var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var schedule = require('node-schedule');
var getweather = require("./getweather");
var configPagePort = 80;

toScreen("Starting...");
fs.readFile(__dirname + "/config/config.json", "utf8", function(err, text) {
	if (err === null) {
		toScreen("Loading config...")
		config = JSON.parse(text);
		if (typeof config == "object" && config !== null) {
			enableWebConfig();
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
			toScreen("Error: configuration file does not contain a valid object.");
		}
	} else {
		toScreen("Error: " + err + " when reading configuration.");
	}
});

function toScreen(str) {

	var now = new Date();
	var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
	var time = [now.getHours(), now.getMinutes(), now.getSeconds()];
	var suffix = (time[0] < 12) ? "AM" : "PM";

	time[0] = (time[0] < 12) ? time[0] : time[0] - 12;
	time[0] = time[0] || 12;

	for (var i = 1; i < 3; i++) {
		if (time[i] < 10) {
			time[i] = "0" + time[i];
		}
	}

	console.log("[WeatherMon] " + date.join("/") + " " + time.join(":") + " " + suffix + " " + str);
}

function enableWebConfig() {
	var app = express();

	app.use(express.static(__dirname + '/config'));
	app.use(bodyParser.json());

	app.post('/config.json', function(request, response) {
		console.log(request.body); // your JSON
		response.send(request.body); // echo the result back
		fs.writeFile(__dirname + "\\config\\config.json", JSON.stringify(request.body), function(err) {
			console.log(err)
		});
	});

	app.listen(process.env.PORT || configPagePort);
	toScreen("Configuration page listening on http://127.0.0.1:" + configPagePort);
}