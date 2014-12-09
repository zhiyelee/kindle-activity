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

// index
app.use(kr.get('/', function *() {
  var items = yield util.getItems();
  // TODO 404 page
  if (typeof items !== 'object') {
    this.body = items;
    return;
  }

  // render html
  var res = yield views('index', {
    items: util.tailorItems(items, 150)
  });
  this.body = res;
}));

// page page
app.use(kr.get('/page/:num', function *(num) {
  if (!/^\d*$/.test(num)) return;

  num = parseInt(num, 10);
  var items = yield util.getItems(num);
  if (typeof items !== 'object') {
    this.body = items;
    return;
  }
  // TODO /page/2
  // render html
  var res = yield views('index', {
    items: util.tailorItems(items, 150)
  });
  this.body = res;
}));

// item page
app.use(kr.get('/:id', function *(id) {
  var item = yield util.getItem(id);
  // TODO 404 page
  if (typeof item !== 'object') {
    this.body = item;
    return;
  }

  // render html
  var res = yield views('item', {
    title: id,
    item: item
  });

  this.type = 'html';
  this.body = res;
}));

app.listen(3000);
