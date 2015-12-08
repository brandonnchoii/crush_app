var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
console.log("connectionstr");
console.log(connectionString);


router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', '../', 'client', 'views', 'index.html'));
});

router.get('/page/:pageToView', function(req, res){
    var page = req.params.pageToView;
    res.sendFile(path.join(__dirname, '../', '../', 'client', 'views', page));
});

router.get('/images/:image', function(req, res){
    var image = req.params.image;
    res.sendFile(path.join(__dirname, '../', '../', 'client', 'images', image));
});

router.get('/stylesheets/:page', function(req, res){
    var page = req.params.page;
    res.sendFile(path.join(__dirname, '../', '../', 'client', 'public', 'stylesheets', page));
});

router.get('/crush/user/:uid', function(req, res){
    console.log('enter rest call');
    //console.log(req);
    //console.log(req.body);
    var id = req.params.uid
    
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
        //phone is kept private unless there is a match, right?
        var query = client.query("SELECT name, gender, email, birthday, city, joindate, commitlevel, interestedin, profpic FROM userinf WHERE uid=($1);", [id]);
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



router.get('/crush/user/:email/:pw', function(req, res){
    console.log('enter rest call');
    //console.log(req);
    //console.log(req.body);
    var email = req.params.email
    var pw = req.params.pw
    console.log(email);
    console.log(pw);

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
        var query = client.query("SELECT * FROM userinf WHERE email=($1) AND password=($2);", [email, pw]);
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

router.post('/crush/user', function(req, res) {
    console.log("REST request to create a new user");

    var results = [];    

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query("INSERT INTO userinf(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [req.body.name, req.body.password, req.body.gender, req.body.email, req.body.birthday, req.body.phone, req.body.city, req.body.joinDate, req.body.commit, req.body.sexOrientation]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM userinf WHERE email=($1);", [req.body.email]);

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

router.get('/crush/interests/:uid', function(req, res){
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


router.post('/crush/interests/:uid', function(req, res) {

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

router.delete('/crush/interests/:uid/:interest', function(req, res) {

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

// get all userinfo for one user
//this is probably not necessary because 
/*router.get('/crush/userinfo/:uid', function(req, res){
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
        var query = client.query("select name,gender,birthday,city, joindate, commitLevel, interestedIn, profpic from UserInf where uid = ($1);", [id]);
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
})*/

//returns the names of all the relationships for one user
router.get('/crush/relationships/:uid', function(req, res){
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
        var query = client.query("select name from relationships as r, userinf as u where ((r.user2 = u.uid and r.user1 = ($1)) or (r.user1 = u.uid and r.user2 = ($1)));", [id]);
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

//gets list of all friends for one user
router.get('/crush/friends/:uid', function(req, res){
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
        var query = client.query("select name, uid from friend as f, userinf as u where ((f.fid2 = u.uid and f.fid1 = ($1)) or (f.fid1 = u.uid and f.fid2 = ($1)));", [id]);
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

//add a new friend // TODO: make this into an autocompleting search box
router.post('/crush/friend/:uid/:friend', function(req, res) {

    var results = [];
    var id = req.params.uid;
    var fid = req.params.friend;

    // Grab data from http request

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query("INSERT INTO friend(fid1, fid2) values($1, $2);", [id, fid]);

        // SQL Query > Select Data
        var query = client.query("select name from friend as f, userinf as u where ((f.fid2 = u.uid and f.fid1 = ($1)) or (f.fid1 = u.uid and f.fid2 = ($1)));", [id]);

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

//gets any unseen messages for the uid
//still need to write query to update messages as seen
//router.get('/crush/newmess/:uid', function(req, res){
    //var results = [];
    //var id = req.params.uid;

    // Get a Postgres client from the connection pool
    //pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors

        //if(err) {
          //done();
          //console.log(err);
          //return res.status(500).json({ success: false, data: err});
        //}

        // SQL Query > Select Data
        //var query = client.query("select * from notifications as n, notifstate as s where s.seen = true AND s.sid = nid AND ($1) = n.nTo;", [id]);
        // Stream results back one row at a time
        //query.on('row', function(row) {
            //results.push(row);
        //});

        // After all data is returned, close connection and return results
        //query.on('end', function() {
            //done();
            //return res.json(results);
        //});
    //});
//});


//get all messages to a uid
//need still to update any unseen messages to seen
router.get('/crush/allmess/:uid', function(req, res){
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
        var query = client.query("select u.uid, u.name, mess.text, mess.ts from userinf as u,"+
                                " (select * from notifications as n where (n.nTo = ($1) and "+
                                "EXISTS(select * from relationships as r "+
                                "where( (r.user1 = n.nTo and r.user2=n.nFrom and isReciprocated = true )"+
                                " OR (r.user2 = n.nTo and r.user1=n.nFrom and isReciprocated = true )))))"+
                                " as mess where u.uid = mess.nFrom;", [id]);
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

//to post a new message, need to figure out how to do timestamps automatically
// ^ this can be done from the front-end and sent to the server
router.post('/crush/message/:uid/:idto', function(req, res) {

    var results = [];
    var id = req.params.uid;
    var to = req.params.idto;

    // Grab data from http request
    var data = {
        time: req.body.time,
        message: req.body.text  //.text because it is from a form. Otherwise, you can specify the data yourself
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
        client.query("INSERT INTO notifications(nFrom, nTo, ts , text) values(($1), ($2), ($3), ($4));", [id, idto, data.time, data.message]);
        //client.query("INSERT INTO notifications(nFrom, nTo, ts , text) values(($1), ($2),'2011-08-09 04:04', ($3));", [id, idto, data.interest]);
        client.query("INSERT INTO notifState(seen) VALUES (false);");
        client.query("INSERT INTO relationships VALUES ($1, $2, false);");

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM notifications WHERE nFrom=($1) ORDER BY nid;", [id]);

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

router.get('/crush/name/:uid', function(req, res){
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
        var query = client.query("select name from userinf where uid = ($1);", [id]);
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


router.get('/crush/suggesstions/:uid', function(req, res){
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
        var query = client.query("select u.uid, u.name, mess.text, mess.ts from userinf as u,"+
                                " (select * from notifications as n where (n.nTo = ($1) and "+
                                "EXISTS(select * from relationships as r "+
                                "where( (r.user1 = n.nTo and r.user2=n.nFrom and isReciprocated = true )"+
                                " OR (r.user2 = n.nTo and r.user1=n.nFrom and isReciprocated = true )))))"+
                                " as mess where u.uid = mess.nFrom;", [id]);
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
