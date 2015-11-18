// npm install node
// npm install express
// npm install ejs
// npm install body-parser

// npm i -g bower
// bower install bootstrap

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

//configure app

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); //__dirname is the folder that contains this current script

// use middleware
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser());

// define routes
app.use(require('./routes'));

//start the server
app.listen(1337, function(){
	console.log('ready on port 1337');
})



// var app = require('express').createServer();

// app.get('/', function(req, res){
// 	res.send("Hello Server");
// });

// app.listen(3000);



//Simple web server

// var http = require('http');

// http.createServer(function(req, res){
// 	res.writeHead(200, {'Content-Type': 'text/plain'});
// 	res.end('Hello World\n');
// }).listen(1337, '127.0.0.1');

// console.log('Server running at http://127.0.0.1:1');



