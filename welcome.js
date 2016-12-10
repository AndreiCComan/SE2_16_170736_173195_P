/** Import Node.js modules
 *	express 		-> used to handle requests to the server
 *	body-parser	 	-> used to parse the body of the requests
 *	googlemapsutil	-> Google API for Directions and Geocoding services
 *	model.js		-> used to build the object that has to be returned to the requester
 */
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var googleMapsUtil = require('googlemapsutil');
var model = require("./model.js");

/** Set the body-parser to the Node.js app
 *	This has to be done in order to read the requests' body
 */
app.use(bodyParser.urlencoded({
	extended: false
}));

/** Bind to the Node.js app a port variable that has to be used subsequently
 *	We firstly check if the environmental variable PORT has previously been set.
 * 	If it is not the case we set the port value to 5000
 */
app.set('port', (process.env.PORT || 5000));

/** Set set the port at which the Node.js app will listen
 */
app.listen(app.get("port"), function () {
	console.log("Server running at port " + this.address().port);
});

/** Handle static files in the current directory. 
 *  This has to be done in order to retrieve all files like images, stylesheets and scripts
 */
app.use(express.static(__dirname + "/"));

/** Handler for /getMap POST requests
 *  The requester sends a transit mode, a departure and arrival address
 *  The requester expects to receive the correspondig directions in the form of a JSON object
 *	NOTE: Google Maps API Directions has been used in order to accomplish this task
 */
app.post("/getMap", function (req, res) {

	//specify the content to be returned by the server
	res.setHeader('Content-Type', 'application/json');

	//retreive the parameters from the request
	var departure = req.body.departure;
	var arrival = req.body.arrival;
	var mode = req.body.mode;

	console.log("-----------------------------------");
	console.log("Departure received = " + departure);
	console.log("Arrival received = " + arrival);
	console.log("Mode received = " + mode);
	console.log("-----------------------------------");

	if (checkParametersGetMap(departure, arrival, mode)) //check valid parameters
		res.status(449).send("notValidForm");
	else {
		//replace spaces with + in order to use the API. The latter does not accept spaces in the request.
		departure = departure.replace(/ /g, '+');
		arrival = arrival.replace(/ /g, '+');
		mode = mode.replace(/ /g, '+');

		//call the API
		googleMapsUtil.directions(
			departure,
			arrival, {
				mode: mode
			},
			function (err, result) {
				if (err) { //check Service availability
					console.log("Google Maps ERROR: " + err);
					res.status(503).send("ServiceDirectionsUnavailable");
				} else {
					result = JSON.parse(result);
					console.log("Google Maps status = " + result.status);
					if (result.status == "OK") {
						//use the model function in order to build the result that has to be sent as response to the requester
						result = model.buildObjectStructureDirections(result);
						res.status(200).send(result);
					} else if (result.status == "NOT_FOUND" && //check for Google API Service errors
						result.status == "ZERO_RESULTS" &&
						result.status == "INVALID_REQUEST") {
						res.status(449).send(result.status);
					} else {
						res.status(404).send(result.status);
					}
					console.log("Response sent back to the requester!");
				}
			}
		);

	}
});

/** Handler for /getUser POST requests
 *	Coordinates are translated in a corresponding street name
 *  The requester sends coordinates of his position
 *  The requester expects to receive the correspondig street name in the form of a JSON object
 *	NOTE: Google Maps API Geocoding has been used in order to accomplish this task
 */
app.post("/getUserLocation", function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	var lat = req.body.latitude;
	var lng = req.body.longitude;
	if (checkParametersGetUserLocation(lat, lng)) //check valid parameters
		res.status(449).send("notValidCoordinates");
	else {
		console.log("-----------------------------------");
		console.log("Latitude received = " + lat);
		console.log("Longitude received = " + lng);
		console.log("-----------------------------------");
		googleMapsUtil.reverseGeocoding(
			lat,
			lng,
			null,
			function (err, result) {
				if (err) {
					console.log("Google Maps ERROR: " + err);
					res.status(503).send("ServiceGeocodingUnavailable");
				} else {
					result = JSON.parse(result);
					var address = result.results[0].formatted_address;
					var objectToReturn = {
						"address": address
					};
					res.status(200).send(objectToReturn);
				}
			}
		);
		console.log("Response sent back to the requester!");
	}
});

/** Handler for POST and GET requests at / path. 
 *	The response sent back contains the index page where the user can interact with the app.
 */
app.use("/", function (req, res) {
	res.end("./index.html");
});

//Check Parameters Functions
function checkParametersGetMap(departure, arrival, mode) {
	if (departure == "" ||
		departure == undefined ||
		!isNaN(departure) ||
		arrival == "" ||
		arrival == undefined ||
		!isNaN(arrival) ||
		mode == "" ||
		mode == undefined ||
		!isNaN(mode))
		return true;
	else
		return false;
}

function checkParametersGetUserLocation(lat, lng) {
	if (lat == "" ||
		lat == undefined ||
		isNaN(lat) ||
		lng == "" ||
		lng == undefined ||
		isNaN(lng))
		return true;
	else
		return false;
}
