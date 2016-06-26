/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:40:25
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 11:45:04
*/

'use strict';

var Log = {
  info: function(message) {
    if (logLevel >= 4) {
      console.log(message);
    }
  },

  warn: function(message) {
    if (logLevel >= 3) {
      console.log(message);
    }
  },
  error: function(message) {
    if (logLevel >= 2) {
      console.log(message);
    }
  },

  critical: function(message) {
    if (logLevel >= 1) {
      console.log(message);
    }
  }
}
module.exports = Log;
