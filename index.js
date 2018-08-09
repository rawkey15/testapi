var express = require('express');
var app = express();
var cricapi = require("node-cricapi");
var request = require('request');

app.set('port', (process.env.PORT || 5000));

//setup cross-origin

var cors =  {

            origin: ["https://rakesh-angular-dashboard.herokuapp.com"],

            default: "https://rakesh-angular-dashboard.herokuapp.com" 
        }

app.use(function(req, res, next) {

  var origins = cors.origin.indexOf(req.header('origin')) > -1 ? req.headers.origin : cors.default;

  res.header("Access-Control-Allow-Origin", origins);

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  next();

});


app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//Router for rest api

var v3_apikey = '32047621915820fa1caf5db2a806146e';
var v4_authToken = 'BearereyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjA0NzYyMTkxNTgyMGZhMWNhZjVkYjJhODA2MTQ2ZSIsInN1YiI6IjU5NDAyMzc2OTI1MTQxN2E4MzAwOGEwNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3sGZZ6y-MFJPf7GVjP8sgrxqw_O0iXzXWXMn_iD0c2k';

app.get('/search/:movie', function(req, res, next) {
var moviename = req.params.movie;
  request({
    uri: 'https://api.themoviedb.org/3/search/movie?api_key='+v3_apikey+'&query='+moviename
  }).pipe(res);
});

app.get('/movie/:id', function(req, res, next) {
var movieid = req.params.id;
  request({
    uri: 'https://api.themoviedb.org/3/movie/'+movieid+'?api_key='+v3_apikey+'&append_to_response=videos'
  }).pipe(res);
});

app.get('/movieslist', function(req, res, next) {

var options = { method: 'GET',
  url: 'https://api.themoviedb.org/4/list/1',
  qs: 
   { language: 'english',
     api_key: v3_apikey,
     page: '1' },
  headers: 
   { authorization: v4_authToken,
     'content-type': 'application/json;charset=utf-8' },
  body: {},
  json: true };

request(options).pipe(res);
});







