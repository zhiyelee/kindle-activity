var koa = require('koa');
var app = koa();
var router = require('./lib/router');

// x-response-time
app.use(function *(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});
// logger
app.use(function *(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});
router.init(app);

app.listen(3000);