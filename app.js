var koa = require('koa');
var kr = require('koa-route');
var app = koa();
var util = require('./lib/util');
var views = require('./lib/views');
var serveStatic = require('koa-static');

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
app.use(serveStatic('static'));
app.use(kr.get('/', function *() {
  this.body = 'index';
}));
app.use(kr.get('/:id', function *(id) {
  var item = yield util.getActivity(id);
  // TODO 404 page
  if (typeof item !== 'object') {
    this.body = item;
    return;
  }

  // render html
  var res = yield views('layout', {
    title: id,
    item: item
  });

  this.type = 'html';
  this.body = res;
}));

app.listen(3000);
