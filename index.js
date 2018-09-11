var express = require('express');
var app = express();
var request = require('request');

const phantom = require('phantom');
let gCookie = null;

app.set('port', (process.env.PORT || 5000));

//setup cross-origin

var cors =  {
    origin: ["<<your allowed domains>>"],
    default: "<<your default allowed domain>>" 
};

app.use(function(req, res, next) {

  var origins =  req.headers.origin ;

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

var key = 'ra15';

app.get('/token/:id/:site/:ckey', function(req, res, next) {
  var unique_id = req.params.id;
  var site = req.params.site;
  var ckey = req.params.ckey;
  
 // console.log(unique_id+"::"+site);
  if(unique_id === key && site){
    let concat='https://'+site;
    (async function() {
      const instance = await phantom.create();
      const page = await instance.createPage();
     /* await page.on('onResourceRequested', function(requestData) {
        console.info('Requesting', requestData.url);
      });*/
    
      const status = await page.open(concat);
      //const content = await page.property('content');
      //console.log(content);
    
      await page.evaluate(function() {
        return document.cookie;
        }).then(function(c){
           // console.log(c);
            let getCookie = function(cname,cook) {
                var name = cname + "=";
                var decodedCookie = decodeURIComponent(cook);
               // console.log(cook);
                var ca = decodedCookie.split(';');
                for(var i = 0; i <ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return null;
            } 
            gCookie= getCookie(ckey, c);
          //  gCookie = c.split(';');
            //console.log(gCookie);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ t: gCookie }));
        });
    
     await instance.exit();
    })();

  } else {
    return null;
  }
  
});

app.get('/match/:id', function(req, res, next) {
var unique_id = req.params.id;
  request({
    uri: 'http://cricapi.com/api/cricketScore?unique_id='+unique_id+'&apikey='+key    
  }).pipe(res);
});

app.get('/match/summary/:id', function(req, res, next) {
var unique_id = req.params.id;
  request({
    uri: 'http://cricapi.com/api/fantasySummary?unique_id='+unique_id+'&apikey='+key 
  }).pipe(res);
});

app.get('/match/squad/:id', function(req, res, next) {
var unique_id = req.params.id;
  request({
    uri: 'http://cricapi.com/api/fantasySquad?unique_id='+unique_id+'&apikey='+key    
  }).pipe(res);
});

app.get('/player/:id', function(req, res, next) {
var pid = req.params.id;
  request({
    uri: 'http://cricapi.com/api/playerStats?pid='+pid+'&apikey='+key    
  }).pipe(res);
});

app.get('/matchcalender', function(req, res, next) {
var pid = req.params.id;
  request({
    uri: 'http://cricapi.com/api/matchCalendar&apikey='+key    
  }).pipe(res);
});









