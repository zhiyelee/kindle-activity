var util = require('./lib/util');
var exec = require('child_process').exec;
var fs = require('fs');

var url = 'https://kindle.amazon.com/profile/zhiyelee/11533613';
var lastestItem = util.getLatestItem();

lastestItem.then(function (cid) {

  var cmd = 'casperjs lib/casper.js '
      + ' --url=' + url;
  if (uid) {
    cmd += ' --cid=' + cid;
  }

  exec(cmd, function (err) {
    if (err) console.log(err);

    var entryList = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    util.save2db(entryList);
  });
});
