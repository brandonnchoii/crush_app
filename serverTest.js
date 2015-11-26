var app = require('express').createServer();

app.get('/', function(req, res){
	res.send("Hello Server");
});

app.listen(3000);