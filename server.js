/*==============================================================================
weathermon - server.js 

Entrypoint for the Weathermon app. This file reads the configuration file and
schedules requests based on the data it finds. 

Author: Dennis J Kurlinski
==============================================================================*/

// Required Modules //
var fs = require("fs");
//var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var schedule = require("node-schedule");
var getweather = require("./getweather");
var utils = require("./utils");
var configPagePort = 80;

utils.toScreen("Starting...");

fs.readFile(__dirname + "/config/config.json", "utf8", function(err, text) {

	if (err === null) {

		utils.toScreen("Loading config...");
		var config = JSON.parse(text);

		if (typeof config == "object" && config !== null) {

			//enableWebConfig();

			config.schedules.forEach(function(sched) {
				
				var rule = new schedule.RecurrenceRule();
				rule.dayOfWeek = sched.days;
				var clock = sched["clock"].split(":");
				rule.hour = parseInt(clock[0]);
				rule.minute = parseInt(clock[1]);

				var newSchedule = new schedule.scheduleJob(rule, function() {
					var request = config.requests[sched.request];
					if (request["type"] == "yahoo") {
						utils.toScreen("Scheduling " + request["name"] + " on sched " + sched["name"]);
						getweather.getYahooWeather(
							request["location"],
							request["template"],
							request["output"],
							function(err, data) {
								if (err === null) {
									utils.toScreen("Executed request profile: " +
										request["name"] +
										" using schedule: " +
										sched["name"]);
								}
							});
					}
				});
				//}
			});

			utils.toScreen("Running...");
		} else {
			utils.toScreen("Error: configuration file does not contain a valid object.");
		}
	} else {
		utils.toScreen("Error: " + err + " when reading configuration.");
	}
});

function enableWebConfig() {
	var app = express();

	app.use(express.static(__dirname + "/config"));
	app.use(bodyParser.json());

	app.post("/config.json", function(request, response) {
		console.log(request.body); // your JSON
		response.send(request.body); // echo the result back
		fs.writeFile(__dirname + "\\config\\config.json",
			JSON.stringify(request.body),
			function(err) {
				console.log(err);
			});
	});

	app.listen(process.env.PORT || configPagePort);
	utils.toScreen("Configuration page listening on http://127.0.0.1:" + configPagePort);
}