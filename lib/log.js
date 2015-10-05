var chalk = require('chalk');
var moment = require('moment');

/**
 * colored log with timestamp
 * @param msg
 */
function log(msg) {
  var ts = chalk.green(moment().format());
  console.log.apply(console, [`[${ts}]  - `].concat(Array.from(arguments)));
}

module.exports = log;
