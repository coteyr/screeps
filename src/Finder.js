/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-09 05:37:35
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-09 05:41:51
*/

'use strict';

var Finder = {
  findCreeps: function(role, roomName) {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role && creep.room.name === roomName);
  }
}

module.exports = Finder;
