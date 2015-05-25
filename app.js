var koa = require('koa');
var app = koa();
var router = require('./lib/router');
var util = require('./lib/util');
var config = util.loadConfig();
var bodyParser = require('koa-bodyparser');

// setup crontab
util.crontab();

// x-response-time
app.use(function *(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});
app.use(bodyParser());
// logger
app.use(function *(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  util.log('%s %s - %s', this.method, this.url, ms);
});
router.init(app);

app.listen(config.port);
