var koa = require('koa');
var kr = require('koa-route');
var app = koa();
var util = require('./lib/util');

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
app.use(kr.get('/', function *() {
  this.body = 'index';
}));
app.use(kr.get('/:id', function *(id) {
  var bd = yield util.getActivity(id);
  if (typeof bd === 'object') {
    content = bd.content;
  } else {
    content = bd;
  }
  this.body = content;
}));

app.listen(3000);
