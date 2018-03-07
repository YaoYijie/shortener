function shortUrlHandler(db) {
  this.praseAndJump = function(req, res) {
    var shortUrl = req.params.shortUrl;
    console.log(shortUrl);
    var urls = db.collection('urls');
    urls.findOne({short_url: +shortUrl}, function(err, doc) {
      console.log(doc);
      if(doc){
        var originalUrl = doc.original_url;
        res.redirect(originalUrl);
      }else {
        res.send('Short url not found. QAQ');
      }
    })
  }
}

module.exports = shortUrlHandler;
