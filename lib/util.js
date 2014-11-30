/**
 * Created by lizhiye on 11/26/14.
 */
var Q = require('q');
var modelInfo = require('./activityModel');
var Model = modelInfo.model;


var count = 0;
function save2db(entryList, cb) {
  count = entryList.length;
  entryList.forEach(function (entry) {
    saveItem(entry, cb);
  });
}

function saveItem(entry, cb) {
  var activity = new Model({
    uid: entry[0],
    url: entry[1],
    content: entry[2],
    note: entry[3]
  });

  activity.save(function (err, item) {
    if (err) return console.error(err);
    console.log('item `' + item.uid + '` is inserted.')
    if (--count === 0) {
      cb();
    }
  });
}
exports.save2db = save2db;

function getLatestItem() {
  var deferred = Q.defer();

  Model
      .find()
      .sort({ $natural: 1 })
      .limit(1)
      .exec(function (error, items) {
        if (error) {
          deferred.reject(new Error(error));
        } else {
          deferred.resolve(items[0]);
        }
      });

  return deferred.promise;
}

exports.getLatestItem = getLatestItem;
exports.ActivityModel = Model;

function disconnectDB() {
  modelInfo.db.close();
  console.log('Connect to DB is closed.')
}


exports.disconnectDB = disconnectDB;