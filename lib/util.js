/**
 * Created by lizhiye on 11/26/14.
 */
var Q = require('q');
var ActivityModel = require('./activityModel');

function saveItem(entry) {
  var activity = new ActivityModel({
    uid: entry[0],
    url: entry[1],
    content: entry[2],
    note: entry[3]
  });

  // is this needed? mongodb objectid
  // The ObjectId is generated based on timestamp, machine ID, process ID, and a process-local incremental counter.
  ActivityModel.findOne({uid: entry[0]}, function (err, item) {
    if (err) {
      console.log(err);
      return;
    }
    if (!item) {
      activity.save(function (err, item) {
        if (err) return console.error(err);
        console.log('item `' + item.uid + '` is inserted.')
      });
    }
  });
}

function save2db(entryList) {
  entryList.forEach(function (entry) {
    saveItem(entry);
  })
}

exports.save2db = save2db;

function getLatestItem() {
  var deferred = Q.defer();

  ActivityModel
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

