//Load modules
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

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

/** Handle POST and GET requests at / path. The response sent back contains the index page where
  * the user can interact with the app.
  */
app.use("/", function (req, res) {
    res.end("./index.html");
});

