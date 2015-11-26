var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');

// This may need to be moved to the database document
// http://stackoverflow.com/questions/30979473/get-data-from-database-with-node-js
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


// ============== TODO: http://www.w3schools.com/sql/sql_autoincrement.asp ============
 // $ curl --data "text=test&complete=false" http://127.0.0.1:1337/api/v1/todos

//INSERTION
router.post('/api/v1/todos', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {
    	text: req.body.text, 
    	complete: false
    };


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

//TODO: fix post statmenet
// $ curl --data "name=test&email=test@test.com&birthday=2015&phone=1818181&city=sanfran&joindate=lel" http://127.0.0.1:1337/api/users
// router.post('/api/users', function(req, res) {

//     var results = [];

//     // Grab data from http request
//     var data = {
//     	//id: req.body.int, 
//     	name: req.body.text, 
//     	email: req.body.text,
//     	birthday: req.body.text,
//     	phone: req.body.int,
//     	city: req.body.text,
//     	joindate: req.body.text
//     };
//     console.log(data);

//     // Get a Postgres client from the connection pool

//     pg.connect(connectionString, function(err, client, done) {
//         // Handle connection errors
//         if(err) {
//           done();
//           console.log(err);
//           return res.status(500).json({ success: false, data: err});
//         }

//         // SQL Query > Insert Data
//         client.query("INSERT INTO userinf(name, email, birthday, phone, city, joindate) values($1, $2, $3, $4, $5)", [data.name, data.email, data.birthday, data.phone, data.city, data.joindate]);

//         // SQL Query > Select Data
//         var query = client.query("SELECT * FROM userinf ORDER BY name ASC");

//         // Stream results back one row at a time
//         query.on('row', function(row) {
//             results.push(row);
//         });

//         // After all data is returned, close connection and return results
//         query.on('end', function() {
//             done();
//             return res.json(results);
//         });
//     });
// });

router.get('/api/v1/todos', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC;");

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

router.get('/api/users', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM userinf ORDER BY name ASC;");

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


//UPDATE
router.put('/api/v1/todos/:todo_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.todo_id;

    // Grab data from http request
    var data = {text: req.body.text, complete: req.body.complete};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

        // SQL Query > Update Data
        client.query("UPDATE items SET text=($1), complete=($2) WHERE id=($3)", [data.text, data.complete, id]);

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

router.delete('/api/v1/todos/:todo_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.todo_id;


    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Delete Data
        client.query("DELETE FROM items WHERE id=($1)", [id]);

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