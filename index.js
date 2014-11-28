var util = require('./lib/util');
var exec = require('child_process').exec;
var fs = require('fs');

var url = 'https://kindle.amazon.com/profile/zhiyelee/11533613';
var lastestItem = util.getLatestItem();

lastestItem.then(function (item) {

  var cmd = 'casperjs lib/casper.js '
      + ' --url=' + url;
  if (item && item['uid']) {
    cmd += ' --cid=' + item['uid'];
    console.log('Now the latest item is: ' + item['uid']);
  }

  fs.writeFileSync('data.json','');
  exec(cmd, function (err) {
    if (err) console.log(err);

    var data = fs.readFileSync('data.json', 'utf8');

    if(!data) {
      process.exit(0);
    }

    var entryList = JSON.parse(data);
    util.save2db(entryList);
  });
});
