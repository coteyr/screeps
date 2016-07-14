/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-09 05:37:35
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-14 19:05:47
*/

'use strict';

var Report = {
  addRoomValue: function(room, key, value) {
    if(!Memory.stats) {
      Memory.stats = {}
    }
    Memory.stats["room." + room + "." + key] = value;
  }
}

module.exports = Report;
