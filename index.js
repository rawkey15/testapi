const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const phantom = require('phantom');
let gCookie = null;
const key = 'ra15';
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/token/:id/:site/:ckey', function(req, res, next) {
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
    
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
