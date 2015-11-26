// create a database on Postgres locally
// why is this class even needed?

// node models/database.js		to setup the table and subsequent fields


// var pg = require('pg');
// var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo'; //TODO: replace this with the actual DB on AWS?

// var client = new pg.Client(connectionString); //create client to interact with the database
// client.connect(); // establish communication 
// var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)'); //run SQL query
// query.on('end', function() { client.end(); });
