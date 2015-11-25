var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');

// This may need to be moved to the database document
// http://stackoverflow.com/questions/30979473/get-data-from-database-with-node-js
console.log(__dirname);
console.log(path.join(__dirname, 'config'));
console.log(path.join(__dirname, '../', '../', 'config'));
console.log()
//var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var connectionString = require(path.join(__dirname, 'config'));

//fake database
var todoItems= [
			{ id: 1, desc: 'foo' },
			{ id: 1, desc: 'bar' },
			{ id: 1, desc: 'baz' }
		];

// get homepage
router.get('/', function(req, res){
//load data from DB here
	res.render('index', {
		title: 'Crush',
		items: todoItems
	})
});

router.post('/add', function(req, res){
	var newItem = req.body.newItem;
	console.log(newItem);

	todoItems.push({
		id: todoItems.length + 1,
		desc: newItem
	})

	res.redirect('/');
	console.log('posted')
})

router.post('/api/v1/todos', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {text: req.body.text, complete: false};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });


    });
});


module.exports = router; 