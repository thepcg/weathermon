/*------------------------------------------------------------------------------
Utils.js 
Just a place to stuff things that are useful like conversions.
------------------------------------------------------------------------------*/
module.exports.toScreen = toScreen; //logs stuff to console with a time stamp
module.exports.getOrdinal = getOrdinal; //gets 'nd' or 'st' of a number
module.exports.getProperty = getProperty; //checks object for property
module.exports.getDirection = getDirection; //returns direction from degrees
module.exports.addLocalVariable = addLocalVariable; //adds stuff locally
module.exports.phoeneticalMinutes = phoeneticalMinutes;

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
	console.log("[WeatherMon] " + date.join("/") + " " + time.join(":") + " " +
		suffix + " " + str);
}

function getProperty(obj, prop) {
	var parts = prop.split("."),
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
}

function getDirection(angle) {

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
	return "North";
}

function getOrdinal(i) {
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
}

function phoeneticalMinutes(num) {

	if (num.toString().length == 1) {
		if (num == "0") {
			return "";
		} else {
			return "Oh " + num;
		}
	}

	return num;
}

function addLocalVariable() {
	var days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	];
	var months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];

	var now = new Date();
	var hours = now.getHours();
	var ampm = "";

	if (hours > 11) {
		ampm = "PM";
		if (hours > 12) {
			hours = hours - 12;
		}
	} else {
		if (hours == 0) {
			hours = 12;
		}
		ampm = "AM";
	}

	var minutes = now.getMinutes();
	var time = hours + " " + phoeneticalMinutes(minutes) + " " + ampm;
	var object = {
		"time": time,
		"weekday": [],
		"month": months[now.getMonth()],
		"date": getOrdinal(now.getDate()),
		"year": now.getFullYear()
	};

	for (var i = 0; i < 7; i++) {
		var day = now.getDay() + i;
		if (day > 6) {
			day = day - 7;
		}
		object.weekday[i] = days[day];
	}

	return object;
}