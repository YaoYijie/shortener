var OriginalUrlHandler = require(process.cwd() + '/app/controllers/originalUrlHandler.server.js')
  ShortUrlHandler = require(process.cwd() + '/app/controllers/shortUrlHandler.server.js');

module.exports = function(app, db) {
  var originalUrlHandler = new OriginalUrlHandler(db);
  var shortUrlHandler = new ShortUrlHandler(db);

  app.get('/new/*?', originalUrlHandler.pushUrl);

  app.get('/:shortUrl', shortUrlHandler.praseAndJump);
}
