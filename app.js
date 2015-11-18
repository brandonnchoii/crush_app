var express = require('express');

var app = express();

app.get('/', function(req, res){
	res.send('hello, express!');
});

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



