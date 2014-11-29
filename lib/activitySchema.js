/**
 * Created by lizhiye on 11/25/14.
 */
var mongoose = require('mongoose');

var activitySchema = mongoose.Schema({
  uid: String,
  url: String,
  note: String,
  author: String,
  content: String
  // date: { type: Date, default: Date.now }
});

activitySchema.methods.getActivityById = function (uid, cb) {
  return this.find({uid: uid}, cb);
};

module.exports = activitySchema;
