'use strict';

/*
 * Module Dependencies
 */
var mongoose = require('mongoose'),
    models = mongoose.models;

exports.get = function(req, res) {
  models.Comment.find(function(err, results) {
    if (err) {
      return res.end(JSON.stringify(err));
    }
    return res.end(JSON.stringify(results));
  });
};

exports.post = function(req, res) {
  var comment = new models.Comment(req.body);
  comment.save(function(err) {
    if (err) {
      return res.end(JSON.stringify(err));
    }
    return res.end(JSON.stringify(comment));
  });
};

exports.put = function(req, res) {
  var id = req.params.id;
  models.Comment.findByIdAndUpdate(id, {$inc: {votes: 1}}, function(err, result) {
     if (err) {
       return res.end(JSON.stringify(err));
     }
     return res.end(JSON.stringify(result));
  });
};

exports.del = function(req, res) {

  var id = req.params.id;
  console.log(id);
  models.Comment.findByIdAndRemove(id, function(err, comment) {
    if (err) {
      return res.end(JSON.stringify(err));
    }

    return res.end(comment);

  });
};
