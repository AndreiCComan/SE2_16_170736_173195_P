var polyline = require('polyline-encoded');

var buildObjectStructure = function (result) {
	//Data fetch
	var departureLocation = result.routes[0].legs[0].start_location;
	var departureAddress = result.routes[0].legs[0].start_address;
	var arrivalLocation = result.routes[0].legs[0].end_location;
	var arrivalAddress = result.routes[0].legs[0].end_address;
	var routeDistance = result.routes[0].legs[0].distance.text;
	var routeDuration = result.routes[0].legs[0].duration.text;
	var polylineDecoded = polyline.decode(result.routes[0].overview_polyline.points);
	var latlng = [];
	polylineDecoded.map(function (item) {
		latlng.push({
			lat: item[0],
			lng: item[1]
		});
	});
	
	//Object Construction
	var returnObject = {};
	returnObject.polyline = latlng;
	returnObject.departureLocation = departureLocation;
	returnObject.departureAddress = departureAddress;
	returnObject.arrivalLocation = arrivalLocation;
	returnObject.arrivalAddress = arrivalAddress;
	returnObject.routeDistance = routeDistance;
	returnObject.routeDuration = routeDuration;

	return returnObject;
}

exports.buildObjectStructure = buildObjectStructure;
