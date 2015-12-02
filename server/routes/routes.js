var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', '../', 'client', 'views', 'index.html'));
});

// router.get('*', function(req, res, next) {
//   res.sendFile(path.join(__dirname, '../', '../', 'client', 'views', 'index.html')); //TODO make this its specific name
// }); //TODO put controller in every path

//router.get('/client/views/templates/header.html')


// router.get('/test.html', function(req, res, next) {
//   res.sendFile(path.join(__dirname, '../', '../', 'client', 'views', 'test.html'));
// });


router.get('/pages/:page', function(req, res, next) {
  var page = req.params.page;
  console.log(page);
  res.sendFile(path.join(__dirname, '../', '../', 'client', 'views', page + ".html")); //TODO make this its specific name
});

router.get('api/crush/interests/:uid', function(req, res){
    var results = [];
    var id = req.params.uid;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT interest FROM userinterests WHERE uiid=($1) ORDER BY uiid ASC;", [id]);
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
})

router.get('api/login/:email/:pw', function(req, res){
    var results = [];
    var email = req.params.email;
    var password = req.params.pw;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT uid FROM userinf WHERE email=($1) AND password=($2);", [email, password]);
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
})


router.post('api/crush/interests/:uid', function(req, res) {

    var results = [];
    var id = req.params.uid;

    // Grab data from http request
    var data = {
        interest: req.body.text  //.text because it is from a form. Otherwise, you can specify the data yourself
    };

    console.log(data);

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query("INSERT INTO userinterests(uiid, interest) values($1, $2)", [id, data.interest]);

        // SQL Query > Select Data
        var query = client.query("SELECT interest FROM userinterests WHERE uiid=($1) ORDER BY uiid ASC;", [id]);

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

router.delete('api/crush/interests/:uid/:interest', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.uid;
    var interest = req.params.interest;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Delete Data
        client.query("DELETE FROM userinterests WHERE uiid=($1) AND interest=($2)", [id, interest]);

        // SQL Query > Select Data
        var query = client.query("SELECT interest FROM userinterests WHERE uiid=($1) ORDER BY uiid ASC;", [id]);

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

// router.put('/crush/interest/:uid', function(req, res) {

//     var results = [];

//     // Grab data from the URL parameters
//     var id = req.params.todo_id;

//     // Grab data from http request
//     var data = {text: req.body.text, complete: req.body.complete};

//     // Get a Postgres client from the connection pool
//     pg.connect(connectionString, function(err, client, done) {
//         // Handle connection errors
//         if(err) {
//           done();
//           console.log(err);
//           return res.status(500).send(json({ success: false, data: err}));
//         }

//         // SQL Query > Update Data
//         client.query("UPDATE items SET text=($1), complete=($2) WHERE id=($3)", [data.text, data.complete, id]);

//         // SQL Query > Select Data
//         var query = client.query("SELECT * FROM items ORDER BY id ASC");

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


module.exports = router;
