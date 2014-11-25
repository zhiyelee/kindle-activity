/**
 * Created by lizhiye on 11/25/14.
 */

var mongoose = require('mongoose');
var activitySchema = require('./activitySchema');
mongoose.connect('mongodb://localhost/kindleActivity');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    // yay!
    console.log('connect to db');
});

module.exports = mongoose.model('activity', activitySchema);
