/**
 * Created by lizhiye on 11/26/14.
 */
var Q = require('q');
var modelInfo = require('./activityModel');
var Model = modelInfo.model;


function save2db(entryList, cb) {
  // wrap the cb to make it called until the end of the iteration
  var cbwrap = function () {
    var count = entryList.length;
    return function () {
      count--;
      if (count === 0) {
        cb();
      }
    }
  }();

  entryList.forEach(function (entry) {
    saveItem(entry, cbwrap);
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

    console.log('item `' + item.uid + '` is inserted.');
    cb();
  });
}
exports.save2db = save2db;

function getLatestItem() {
  var deferred = Q.defer();

  Model
      .find()
      .sort({$natural: 1})
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

function getActivity(id) {
  var deferred = Q.defer();
  Model.findOne({uid: id}, function (err, item) {
    if (err) {
      deferred.reject(err)
    }

    if (item) {
      deferred.resolve(item)
    } else {
      deferred.resolve('Not found');
    }

  });

  return deferred.promise.then(function (item) {
    return item;
  });

}

exports.getActivity = getActivity;
