/**
 * Created by lizhiye on 11/25/14.
 */

var mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment'),
  activitySchema = require('./activitySchema');

mongoose.connect('mongodb://localhost/kindleActivity');

var db = mongoose.connection;

// add autoincrement `ts` field
autoIncrement.initialize(db);
activitySchema.plugin(autoIncrement.plugin, {model: 'activity', field: 'ts'});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('success: connect to db.');
});

exports.model = mongoose.model('activity', activitySchema);

exports.db = db;
