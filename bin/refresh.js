var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var util = require('../lib/util');

var config = util.loadConfig();
var url = config.profileurl;
var lastestItem = util.getLatestItem();

console.log(lastestItem);
lastestItem.then(function (data) {
  console.log(data)
});

