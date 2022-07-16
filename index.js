const express = require('express');
const app = express();
const Routes = require('./routes');
const request = require('request');
const bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//setup cross-origin

var cors = {
    origin: ["http://localhost:4200"],
    default: "http://localhost:4200"
};

app.use(function (req, res, next) {

    var origins = cors.origin.indexOf(req.header('origin')) > -1 ? req.headers.origin : cors.default;

    //res.header("Access-Control-Allow-Origin", origins);

    res.header("Access-Control-Allow-Origin", '*');

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress ;

    next();

});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

Routes(app);



