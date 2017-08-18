const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const passport = require('passport');
const { BasicStrategy } = require('passport-http');

const app = express();
app.use(bodyParser.json());

const client = new Client({
  username: 'adamjahr',
  host: 'localhost',
  database: 'trackerdb',
  password: '',
  port: 5432
});
client.connect();


app.get('/api/activities', function (request, response) {
  client.query('SELECT * FROM activity', function(err, dbResponse) {
    if (err) {
      console.log(err);
      response.json({ status: 'fail', message: err })
    } else {
      response.json({ status: 'success', data: dbResponse.rows })
    }
  })
});


// get a limited number of todos - /api/todos?n=5
app.get('/api/activities/:id', function (request, response) {
  let id = request.params.id;
  client.query('SELECT * FROM activity WHERE activity_id=$1', [id], function(err, dbResponse) {
    if (err) {
      console.log(err);
      response.json({ status: 'fail', message: err })
    } else {
      response.json({ status: 'success', data: dbResponse.rows })
    }
  })
});

app.post('/api/activities', function (request, response) {
  let name = request.body.name;
  client.query('INSERT INTO activity (name) VALUES ($1)', [name], function (error, dbResponse) {
    if (error) {
      response.json({ status: 'fail', error })
    } else {
      response.json({ status: 'success' })
    }
  })
});

app.delete('/api/activities/:id', function (request, response) {
  let id = request.params.id;
  client.query('DELETE FROM log WHERE activity_id=$1', [id], function (error, dbResponse) {
    if (error) {
      response.json({ status: 'fail log', error })
    } else {
      client.query('DELETE FROM activity WHERE activity_id=$1', [id], function (err, dbRes) {
        if (err) {
          response.json({ status: 'fail activity', err })
        } else {
          response.json({ status: 'activity success' })
        }
      })
    }
  })
})


passport.use(new BasicStrategy(
  function(username, password, done) {
      client.query('SELECT password FROM AppUser WHERE username=$1', [username], function (error, res) {
        if (error) {
          response.json({ status: 'username select fail', error });
        } else {
          const userPassword = res.rows[0].password;
          console.log('userPassword is', userPassword);
          if (!userPassword) { console.log('no password') }
          if (userPassword !== password) { console.log('passwords dont match') }

          // if (!userPassword) { return done(null, false); }
          // if (userPassword !== password) { return done(null, false); }
          return done(null, username);
        }
      })
  }
));

app.get('/api/hello',
    passport.authenticate('basic', {session: false}),
    function (req, res) {
        res.json({"hello": req.user})
    }
);


app.listen(3000, function () {
  console.log('Listening at localhost:3000')
});
