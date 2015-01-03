/**
 * Created by lizhiye on 12/9/14.
 */

var kr = require('koa-route');
var util = require('./util');
var views = require('./views');
var serveStatic = require('koa-static');
var merge = require('util-merge');


function Router() {
  this._routes = [];
}

Router.prototype.init = function (app) {
  this._routes.forEach(function (r) {
    app.use(r);
  });
};

Router.prototype.add = function (cb) {
  this._routes.push(cb);
};

var router = new Router();

function conf(config) {
  return merge(util.loadConfig(), config);
}
/**
 * render index/page page
 * @param num current page, start from 1
 * @returns {*}
 */
function *renderList(num) {
  var itemPerPage = 12;
  var itemCount = yield util.getItemCount();
  num = parseInt(num, 10) - 1;
  // for `page/0`
  num = num < 0 ? 0 : num;
  var items = yield util.getItems(num, itemPerPage);
  if (typeof items !== 'object') {
    this.body = items;
    return;
  }

  var viewConfig = conf({
    items: util.tailorItems(items, 150)
  });

  var index = num + 1;
  var pageCount = Math.ceil(itemCount/itemPerPage);
  if (pageCount > index) {
    viewConfig.next = index + 1;
  }

  if (index > 1) {
    viewConfig.pre = index - 1;
  }

  // render html
  return yield views('index', viewConfig);
}
var indexRouter = kr.get('/', function *() {
  this.body = yield renderList(0);
});
router.add(indexRouter);

// page page
var pageRouter = kr.get('/page/:num', function *(num) {
  if (!/^\d*$/.test(num)) return;

  this.body = yield renderList(num);
});
router.add(pageRouter);

// item page
var itemRouter = kr.get('/:id', function *(id) {
  var item = yield util.getItem(id);

  if (typeof item !== 'object') {
    this.body = item;
    return;
  }

  item.share = item
    .content
    .replace(/^\s+/, '')
    .replace(/\s+/g, ' ')
    .substr(0, 70);
  item.share = item.share < 100 ? item.share : item.share + ' ...';
  item.share = encodeURIComponent(item.share + ' #KA# ');

  // render html
  var res = yield views('item', conf({
    itemId: id,
    item: item
  }));

  this.type = 'html';
  this.body = res;
});
router.add(itemRouter);

// static files
router.add(serveStatic('static'));

module.exports = router;