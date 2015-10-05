"use strict";

var chalk = require('chalk');
var moment = require('moment');

/**
 * colored log with timestamp
 * @param msg
 */
// function log(msg) {
//   var ts = chalk.green(moment().format());
//   console.log.apply(console, [`[${ts}]  - `].concat(Array.from(arguments)));
// }

class MyLog {
  constructor () {
  }
  log () {
    var ts = chalk.green(moment().format());
    console.log.apply(console, [`[${ts}]  - `].concat(Array.from(arguments)));
  }
  error () {
    var ts = chalk.red(moment().format());
    console.error.apply(console, [`[${ts}]  - `].concat(Array.from(arguments)));
  }
  warn () {
    this.error.apply(this, arguments);
  }
}
var log = new MyLog();
module.exports = log;

