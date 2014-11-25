var ActivityModel = require('./lib/activityModel');
var entryList = [];
var Spooky = require('spooky');

var spooky = new Spooky({
  child: {
    transport: 'http'
  },
  casper: {
    logLevel: 'debug',
    verbose: true,
    clientScripts: ["jquery.min.js"]
  }
}, function (err) {
  if (err) {
    console.log(err)
  }
  spooky.start('https://kindle.amazon.com/profile/zhiyelee/11533613');

  spooky.then(function () {
    entryList = this.evaluate(function () {
      var arr = [];

      $('.recentActivityEntry').each(function () {
        var id = $(this).attr('id');
        var info = [];
        info.push(id);

        var href = $('a:first-child', this).attr('href')
        info.push(href);

        var ndContent = $('.sampleHighlight', this);
        var content = $('div:first-child', ndContent).text();
        info.push(content);
        var note = $('.sampleNote', ndContent).text();
        info.push(note);

        arr.push(info);
      });

      return arr
    });
    var instance = this;
    entryList.forEach(function (e) {
      instance.emit('data', e)
    });
  });


  spooky.then(function () {
    this.emit('exit');
  });
  spooky.run();

});
spooky.on('error', function (e, stack) {
  console.error(e);

  if (stack) {
    console.log(stack);
  }
});

spooky.on('data', function (data) {
  save2db(data);
  console.log('destro');
});
spooky.on('exit', function () {
  console.log('process exited');
  process.exit(0)
});


function save2db(e) {
  var activity = new ActivityModel({
    uid: e[0],
    url: e[1],
    content: e[2],
    note: e[3]
  });

  // is this needed? mongodb objectid
  // The ObjectId is generated based on timestamp, machine ID, process ID, and a process-local incremental counter.
  ActivityModel.findOne({uid: e[0]}, function (err, item) {
    if (err) {
      console.log(err)
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

