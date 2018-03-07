function originalUrlHandler(db) {
  var urls = db.collection('urls');

  // 将原 url 存入 mongodb
  this.pushUrl = function(req, res) {
    var originalUrl = req.params[0];
    var validUrl = require('valid-url');
    var fullUrl = req.protocol + '://' + req.get('host');
    if (originalUrl && validUrl.isUri(originalUrl)) {
      urls.findOne({original_url: originalUrl}, function(err, doc) {
        if (doc) {
          var obj = {
            original_url: originalUrl,
            short_url: fullUrl + '/' + doc.short_url
          }
          res.json(obj);
        } else {
          getNextSequenceValue('urlsId', function(value) {
            urls.insertOne({
              short_url: +value,
              original_url: originalUrl
            }, function(err, result) {
              if (err) {
                throw err;
              }
              var obj = {
                original_url: originalUrl,
                short_url: fullUrl + '/' + value
              }
              res.json(obj);
            })
          });
        }
      })
    }else {
      res.send('please use a URI');
    }
  };

  //从 counters 获取待插入 _id 的值
  function getNextSequenceValue(sequenceName, callback){
    var counters = db.collection('counters');
    counters.find({}).toArray(function(err, result) {
      if (err) {
        throw err;
      }
      // console.log(result.length);
      if (result.length != 0) {
        counters.findAndModify(
          {_id: sequenceName},
          [['_id', 1]],
          {$inc:{sequence_value: 1}},
          {new: true},
          function(err, docs) {
            if (err) {
              throw err;
            }
            var value = docs.value.sequence_value;
            callback(value);
        });
      }else {
        counters.insert({
          "_id":"urlsId",
          "sequence_value": 0
        }, function(err) {
          if (err) {
            throw err;
          }
          counters.findAndModify(
            {_id: sequenceName},
            [['_id', 1]],
            {$inc:{sequence_value: 1}},
            {new: true},
            function(err, docs) {
              if (err) {
                throw err;
              }
              var value = docs.value.sequence_value;
              callback(value);
          });
        })
      }

    })
  }

  function findAndModify(counters, sequenceName) {
    counters.findAndModify(
      {_id: sequenceName},
      [['_id', 1]],
      {$inc:{sequence_value: 1}},
      {new: true},
      function(err, docs) {
        if (err) {
          throw err;
        }
    });
  }


}


module.exports = originalUrlHandler;
