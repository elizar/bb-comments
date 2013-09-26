'use strict';
/*
 * Module Dependencies
 */
var dbconfig = require('./config.json'),
    mongoose = require('mongoose');
    mongoose.connect(dbconfig.host + '/' + dbconfig.database);

exports.init = function() {

    var CommentSchema = new mongoose.Schema({//////
    author: {type: String, required: true},
    comment: {type: String, required: true},
    votes: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now}

  });


  /**
   * Models
   */
  mongoose.model('Comment', CommentSchema);

};
