var https = require('https');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var lti = require('ims-lti');
var lti_config = require('./lti.config.json');
//app.use(bodyParser.json());

var ssl_options = {
  key: fs.readFileSync(__dirname + '/ssl/localhost.key'),
  cert: fs.readFileSync(__dirname + '/ssl/localhost.crt'),
  requestCert: false,
  rejectUnauthorized: false
};

app.post('/lti/launch', bodyParser.urlencoded({ extended: false }), function(req, res){
  var provider = new lti.Provider(lti_config.key, lti_config.secret);
  console.log(req.body);
  provider.valid_request(req, function(err, isValid) {
    //res.send("valid_request? " + isValid);
    if(isValid){
      res.redirect('/index');
      //res.render('index');
    }
  });
});

app.get('/index', bodyParser.urlencoded({ extended: false }), function(req, res){
  res.render('index.jade');
});

app.get('/lti/config', function(req, res){
  res.set('Content-Type', 'application/rss+xml');
  res.render('lti_config.ejs');
});

app.listen(3001, function(){
  console.log("http server started at port 3001");
});

var server = https.createServer(ssl_options, app).listen(3002, function(){
  console.log("https server started at port 3002");
});
