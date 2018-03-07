var OriginalUrlHandler = require(process.cwd() + '/app/controllers/originalUrlHandler.server.js');

module.exports = function(app, db) {
  var originalUrlHandler = new OriginalUrlHandler(db);

  app.get('/new/*?', originalUrlHandler.pushUrl);
}
