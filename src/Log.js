/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:40:25
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-21 08:37:30
*/

'use strict';

var Log = {
  debug: function(message) {
    if (logLevel >= 5) {
      console.log('<font color="#444444" severity="5">' + message + '</font>');
    }
  },
  info: function(message) {
    if (logLevel >= 4) {
      console.log('<font color="#66D9EF" severity="4">' + message + '</font>');
    }
  },

  warn: function(message) {
    if (logLevel >= 3) {
      console.log('<font color="#E6961F" severity="3">' + message + '</font>');
    }
  },
  error: function(message) {
    if (logLevel >= 2) {
      console.log('<font color="#D8232E" severity="2">' + message + '</font>');
    }
  },

  critical: function(message) {
    if (logLevel >= 1) {
      console.log('<font color="#FF0000" severity="1">' + message + '</font>');
    }
  },

  tick: function() {
    if (logLevel >= 0) {
      console.log('<font color="#00DD00">TICK: ' + Game.time + '</font> ' + '<span style="color: #63D9CF">CPU: ' + Game.cpu.getUsed() + ' of ' + Game.cpu.limit + ' Bucket: ' + Game.cpu.bucket + '</span>');
    }
  }
}
module.exports = Log;
