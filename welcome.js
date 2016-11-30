//Load modules
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var googleMapsUtil = require('googlemapsutil');
var polyline = require('polyline-encoded');

//Parse the body in order to use the handlers like req.body
app.use(bodyParser.urlencoded({
    extended: false
}));

//Set the port
app.set('port', (process.env.PORT || 5000));

//Set up the app to listen to a specified port
app.listen(app.get("port"), function () {
    console.log("Server running at port " + this.address().port);
});

//Handle static files in the current directory. This has to be done in order to retrieve all files
//like images, stylesheets and scripts
app.use(express.static(__dirname + "/"));

app.post("/getMap", function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var departure = req.body.departure;
    var arrival = req.body.arrival;
    var mode = req.body.mode;

    console.log("-----------------------------------");
    console.log("Departure received = " + departure);
    console.log("Arrival received = " + arrival);
    console.log("Mode received = " + mode);
    console.log("-----------------------------------");

    departure = departure.replace(/ /g, '+');
    arrival = arrival.replace(/ /g, '+');
    mode = mode.replace(/ /g, '+');

    googleMapsUtil.directions(
        departure,
        arrival, {
            mode: mode
        },
        function (err, result) {
            if (err) {
                console.log(err);
            } //DA GESTIRE IL CASO IN CUI GOOGLE FALLISCE, server crasha
            console.log("Response sent back to the request!");
            result = JSON.parse(result);
            var polylineDecoded = polyline.decode(result.routes[0].overview_polyline.points);
            var latlng = [];
            polylineDecoded.map(function (item) {
                latlng.push({lat:item[0], lng: item[1]});
            });
            result.routes[0].convertedLatLng = latlng;
            res.send(result);
        }
    );
});

/** Handle POST and GET requests at / path. The response sent back contains the index page where
 * the user can interact with the app.
 */
app.use("/", function (req, res) {
    res.end("./index.html");
});
