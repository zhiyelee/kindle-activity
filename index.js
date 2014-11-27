var util = require('./lib/util');
var exec = require('child_process').exec;
var fs = require('fs');

var url = 'https://kindle.amazon.com/profile/zhiyelee/11533613';

// TODO get the uid of the lastest activity and pass to the casper
var cmd = 'casperjs lib/casper.js '
    + ' --url=' + url;

exec(cmd, function (err) {
  if (err) console.log(err);

  var entryList = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  util.save2db(entryList);
});
