var util = require('./lib/util');
var exec = require('child_process').exec;
var fs = require('fs');


var dataFile = 'data.json';
var config = util.loadConfig();
var url = config.profileurl;
var lastestItem = util.getLatestItem();

lastestItem.then(function (item) {

  var cmd = 'casperjs lib/casper.js ' + ' --url=' + url;
  if (item && item['uid']) {
    cmd += ' --cid=' + item['uid'];
    console.log('Now the latest item is: ' + item['uid']);
  }

  fs.writeFileSync(dataFile, '');

  exec(cmd, function (err, stdout) {
    if (err) console.log(err);
    console.log(stdout);

    var data = fs.readFileSync(dataFile, 'utf8');

    if(data !== '[]') {
      var entryList = JSON.parse(data);
      util.save2db(entryList, function () {
        util.disconnectDB();
      });
    } else {
      util.disconnectDB()
    }

  });
});
