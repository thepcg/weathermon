/*=========================================================
weathermon - server.js 

Example usage

Author: Dennis J Kurlinski
=========================================================*/

// Required Modules //
var getweather = require("./getweather");

// Global Variables //
var location = "12776596";

getweather.write(location, __dirname + "/templates/template1.txt", __dirname + "/output.txt", function(err, data) {
	console.log(data);
});