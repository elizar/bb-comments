'use strict';
var express = require('express'),
    comments = require('./routes/comments'),
    db = require('./db'),
    app = express();

/*
 * Init DB
 */
db.init();

/*
 * Set all response to JSON format
 */
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.end();
  }
  res.setHeader('Content-Type', 'application/json');
  next();
});
app.use(express.bodyParser());

/*
 * Main Page
 */
app.get('/', function (req, res) {
  res.end('{"message" : "Mailing list web service", "statusCode" : "200"}');
});

/*
 * Mailing List Routes
 */
app.get('/comments', comments.get);
app.del('/comments/:id', comments.del);
app.post('/comments', comments.post);
app.put('/comments/:id', comments.put);

app.listen(9090, function () {
  console.log('server running on port 9090');
});
