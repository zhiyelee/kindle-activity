var mongoose = require('mongoose'),
  log = require('../lib/log').log,
  activitySchema = require('./activitySchema'),
  lastUpdateSchema = require('./lastUpdateSchema');

mongoose.connect('mongodb://localhost/kindleActivity');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  log('success: connect to db.');
});

exports.db = db;
exports.activityModel = mongoose.model('lastUpdate', lastUpdateSchema);

exports.activityModel = mongoose.model('activity', activitySchema);

