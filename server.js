var express = require('express'),
  mongodb = require('mongodb').MongoClient,
  routes = require('./app/routes/index.js');
var app = express();

  mongodb.connect('mongodb://localhost:27017/shortner', function(err, client) {
    var db = client.db('shortner');
    if (err) {
      throw new Error('Database failed to connect.\n' + err);
    }else {
      console.log('MongoDB successfully connected on port 27017');
    }
    app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

    routes(app, db);

    app.listen(process.env.PORT || 3000, function() {
      console.log('Listening on port 3000...');
    })

  })
