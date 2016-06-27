/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:40:25
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 17:14:57
*/

'use strict';

var Log = {
  info: function(message) {
    if (logLevel >= 4) {
      console.log('<span style="color: #66D9EF">' + message + '</span>');
    }
  },

  warn: function(message) {
    if (logLevel >= 3) {
      console.log('<span style="color: #E6961F">' + message + '</span>');
    }
  },
  error: function(message) {
    if (logLevel >= 2) {
      console.log('<span style="color: #D8232E">' + message + '</span>');
    }
  },

  critical: function(message) {
    if (logLevel >= 1) {
      console.log('<span style="color: #FF0000">' + message + '</span>');
    }
  }
}
module.exports = Log;
