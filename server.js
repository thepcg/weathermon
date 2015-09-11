/*=========================================================
weathermon - A simple node.js app that retrieves weather 
information from the specified source and writes the 
information out to a file.

Author: Dennis J Kurlinski
=========================================================*/

// Required Modules //
var http = require("http"); //this module handles making the HTTP request
var fs = require("fs"); // this module handles I/O to disk

// Global Variables //
var url = "http://forecast.weather.gov/MapClick.php?lat=41.77115728300049&lon=-81.04981875199968&FcstType=json";

var getWeather = function(url, callback(err, data)) {
	//Performs the HTTP request for the JSON object located at 'url'
	//JSON object is returned in 'data'

};

var readTemplate = function(template, callback(err, data)) {
	//Reads the specified template

};

var insertWeather = function(templateVerbiage, callback(err, data)) {
	//Puts the weather into the template

};

var writeScript = function(script, callback(err, data)) {
	//Writes out the script

};