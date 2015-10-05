/**
 * Created by lizhiye on 11/26/14.
 */
var Q = require('q')
  , modelInfo = require('./../model/activityModel')
  , activityModel = modelInfo.activityModel
  , fs = require('fs')
  , log = require('./log')
  , path = require('path');

exports.ActivityModel = activityModel;

/**
 * append item to db
 * @param entry
 * @param cb
 */
function saveItem(entry, cb) {
  var urlPrefix = 'https://kindle.amazon.com';
  var activity = new activityModel({
    uid: entry[0],
    url: urlPrefix + entry[1],
    rawUrl: entry[1],
    content: entry[2],
    note: entry[3]
  });

  activity.save(function (err, item) {
    if (err) return console.error(err);

    log(`item ${item.uid} is inserted.`);
    cb();
  });
}

/**
 * save entryList to db
 * @param entryList
 * @param cb called after all the entries been saved to db
 */
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

  entryList.reverse().forEach(function (entry) {
    saveItem(entry, cbwrap);
  });
}
exports.save2db = save2db;

/**
 * get the latest inserted item
 * @returns {r.promise|promise|d.promise|Q.promise|x.ready.promise}
 */
function getLatestItem() {
  var deferred = Q.defer();

  activityModel
    .find()
    .sort({ts: -1})
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


/**
 * close db connect
 */
function disconnectDB() {
  modelInfo.db.close();
  log('Connect to DB is closed.')
}
exports.disconnectDB = disconnectDB;

/**
 * get item by item uid
 * @param id
 * @returns {*}
 */
function getItemById(id) {
  var deferred = Q.defer();
  activityModel.findOne({uid: id}, function (err, item) {
    if (err) {
      deferred.reject(err)
    }

    if (item) {
      deferred.resolve(item)
    } else {
      deferred.resolve('Activity Not Found');
    }

  });

  return deferred.promise;
}
exports.getItem = getItemById;

exports.searchItems = function searchItems(key) {
  var deferred = Q.defer();

  activityModel
    .find({content: new RegExp(key, 'i')})
    .exec(function (err, items) {
      if (err) {
        deferred.reject(err)
      }

      if (items) {
        deferred.resolve(items)
      } else {
        deferred.resolve('No result');
      }
    });

  return deferred.promise;
};

/**
 * get items from pageIndex
 * @param pageIndex start from 0
 * @param itemPerPage count of items in every page
 */
exports.getItems = function (pageIndex, itemPerPage) {
  itemPerPage = itemPerPage | 10;
  pageIndex = pageIndex | 0;

  var startIndex = pageIndex * itemPerPage;
  var deferred = Q.defer();

  activityModel
    .find()
    .sort({ts: -1})
    .skip(startIndex)
    .limit(itemPerPage)
    .exec(function (err, items) {
      if (err) {
        deferred.reject(err);
      }

      if (items) {
        deferred.resolve(items);
      } else {
        deferred.resolve('Activity Not Found');
      }
    });

  return deferred.promise;
};

exports.tailorItems = function (items, len) {
  len = len | 200;
  return items.map(function (val) {
    var content = val.content;
    var more = content.length > len ? '...' : '';

    val.content = content.substr(0, len) + more;
    val.hasMore = true;
    return val;
  });
};

exports.getItemCount = function () {
  var deferred = Q.defer();

  activityModel
    .find()
    .exec(function (err, items) {
      if (err) {
        deferred.reject(err);
      }

      deferred.resolve(items.length);
    });

  return deferred.promise;
};

var yaml = require('js-yaml');
var loadConfig = function () {
  var file = path.resolve(__dirname, '../config.yml');
  var config = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
  return config;
};

exports.loadConfig = loadConfig;

var later = require('later');
var exec = require('child_process').exec;
exports.crontab = function () {
  var conf = loadConfig();
  return later.setInterval(f, later.parse.cron(conf.crontab));

  function f() {
    var bin = path.resolve(__dirname, '../bin/fetch');
    log('Refetch activity...');
    exec(bin, function (err, stdout) {
      if (err) {
        console.log(err)
      }
      log(stdout);
    })
  }
};

