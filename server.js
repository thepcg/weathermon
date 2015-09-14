/*=========================================================
weathermon - server.js 

Example usage

Author: Dennis J Kurlinski
=========================================================*/

// Required Modules //
var getweather = require("./getweather");

// Global Variables //
var location = "12776596";

getweather.getYahooWeather(location, __dirname + "/templates/conditions1.txt", __dirname + "/output_conditions.txt", function(err, data) {
//getweather.getHTTPSWeather("api.forecast.io", "/forecast/3d2049b6bda9719bf81ad723e9b7c643/41.808,-81.080", __dirname + "/templates/template1.txt", __dirname + "/output.txt", function(err, data) {
	console.log(data);
});

getweather.getYahooWeather(location, __dirname + "/templates/today1.txt", __dirname + "/output_today.txt", function(err, data) {
//getweather.getHTTPSWeather("api.forecast.io", "/forecast/3d2049b6bda9719bf81ad723e9b7c643/41.808,-81.080", __dirname + "/templates/template1.txt", __dirname + "/output.txt", function(err, data) {
	console.log(data);
});

getweather.getYahooWeather(location, __dirname + "/templates/tonight1.txt", __dirname + "/output_tonight.txt", function(err, data) {
//getweather.getHTTPSWeather("api.forecast.io", "/forecast/3d2049b6bda9719bf81ad723e9b7c643/41.808,-81.080", __dirname + "/templates/template1.txt", __dirname + "/output.txt", function(err, data) {
	console.log(data);
});