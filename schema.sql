DROP DATABASE IF EXISTS trackerdb;
CREATE DATABASE trackerdb;

\c trackerdb

CREATE TABLE Activity(
  activity_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE AppUser(
  user_id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE Log(
  log_id SERIAL PRIMARY KEY,
  miles FLOAT NOT NULL,
  log_date TIMESTAMP NOT NULL,
  activity_id INTEGER REFERENCES Activity,
  user_id INTEGER REFERENCES AppUser
);



INSERT INTO Activity(name)
VALUES      ('hike'),
            ('row'),
            ('run');

INSERT INTO Log(miles, log_date, activity_id)
VALUES      (2.2, '6-5-17', (SELECT activity_id FROM activity where name='hike')),
            (4.5, '7-27-17', (SELECT activity_id FROM activity where name='run')),
            (6.7, '8-2-17', (SELECT activity_id FROM activity where name='row'));

INSERT INTO AppUser(username, password)
VALUES      ('atomjar', '5F4DCC3B5AA765D61D8327DEB882CF99');
