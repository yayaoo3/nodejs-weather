var express = require('express');
var app = express();
 
// Weather
app.use('/weather', require('./weather/crud'));


//app.use('/public', express.static('public'));
 
app.get('/index.html', function (req, res) {
	   res.sendFile( __dirname + "/" + "index.html" );
})
app.get('/', function (req, res) {
	res.sendFile( __dirname + "/" + "index.html" );
})
 
var server = app.listen(8080,'localhost', function () {
	 
	  var host = server.address().address;
	  var port = server.address().port;
	  console.log(server.address());
	  console.log("訪問地址為 http://%s:%s", host, port)
	 
})




