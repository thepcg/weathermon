/*=========================================================
weathermon - server.js 

Example usage

Author: Dennis J Kurlinski
=========================================================*/

// Required Modules //
var getweather = require("./getweather");

// Global Variables //
var location = "12776596";//woeid for Madison, OH
var outputPath = "C:\\Users\\Username\\Some Folder\\"

getweather.getYahooWeather(location, __dirname + "/templates/conditions1.txt", outputPath + "output_conditions.txt", function(err, data) {});

getweather.getYahooWeather(location, __dirname + "/templates/today1.txt", outputPath + "output_today.txt", function(err, data) {});

getweather.getYahooWeather(location, __dirname + "/templates/tonight1.txt", outputPath + "output_tonight.txt", function(err, data) {});