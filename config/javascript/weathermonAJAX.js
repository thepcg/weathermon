var config;

function loadXMLDoc() {

	var xmlhttp;

	if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari

		xmlhttp = new XMLHttpRequest();

	} else { // code for IE6, IE5

		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

	}

	xmlhttp.onreadystatechange = function() {

		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

			config = JSON.parse(xmlhttp.responseText);
			document.getElementById("request_table").innerHTML=buildRequestTable(config.requests);
			document.getElementById("schedule_table").innerHTML=buildRequestTable(config.schedules);
		}

	}

	xmlhttp.open("GET", "config.json", true);
	xmlhttp.send();
}

function saveXMLDoc() {

	var xmlhttp;

	if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari

		xmlhttp = new XMLHttpRequest();

	} else { // code for IE6, IE5

		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

	}

	config.requests[0].name = document.getElementById("myText").value;
	alert(config.requests[0].name);

	xmlhttp.open("POST", "config.json");
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.send(JSON.stringify(config));
}

function buildRequestTable(obj) {
	var htmlTag = "<table style=&quot;width:95%&quot;>";
	var htmlHeaderRow = "<tr><td>Name</td><td>Type</td><td>Location</td><td>Template</td><td>Output</td></tr>";
	var htmlClosingTag = "</table>";
	var html = htmlTag + htmlHeaderRow 
	for (row in config.requests){
		html = html + "<tr><td><div contenteditable>" + obj[row].name + "</div></td><td><div contenteditable>" + obj[row].type + "</div></td><td><div contenteditable>" + obj[row].location + "</div></td><td><div contenteditable>" + obj[row].template + "</div></td><td><div contenteditable>" + obj[row].output + "</div></td></tr>"
	}

	return html;
}

function buildScheduleTable(obj) {

	var htmlTag = "<table style=&quot;width:95%&quot;>";
	var htmlHeaderRow = "<tr><td>Name</td><td>Days</td><td>Clock</td><td>Request</td></tr>";
	var htmlClosingTag = "</table>";
	var html = htmlTag + htmlHeaderRow 
	for (row in config.requests){
		alert(JSON.stringify (obj[row]));
		html = html + "<tr><td><div contenteditable>" + obj[row].name + "</div></td><td><div contenteditable>" + JSON.stringify(obj[row].days) + "</div></td><td><div contenteditable>" + obj[row].clock + "</div></td><td><div contenteditable>" + obj[row].request + "</div></td></tr>"
	}

	return html;
	
}

function addNewRequest(){
	config.requests.push({
		"name": "New Request",
		"type": "",
		"location": "",
		"template": "",
		"output": ""
	});
	document.getElementById("request_table").innerHTML=buildRequestTable(config.requests);
}

function addNewSchedule(){
	config.schedules.push({
		"name": "New Schedule",
		"days": [0, 1, 2, 3, 4, 5, 6],
		"clock": "23:47",
		"request": 0
	});
	document.getElementById("schedule_table").innerHTML=buildRequestTable(config.schedules);
}