/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-09 05:37:35
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-11 21:14:47
*/

'use strict';

var Finder = {
  findCreeps: function(role, roomName) {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role && creep.room.name === roomName);
  },
  findAllCreeps: function(role) {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role);
  },
  findCreepCount: function(role, spawn) {
    return _.size(Finder.findCreeps(role, spawn.room.name)) + _.filter(spawn.memory.spawn_queue, {'role': role}).length;
  },
  findAllCreepCount: function(role, spawn) {
    return _.size(Finder.findAllCreeps(role)) + _.filter(spawn.memory.spawn_queue, {'role': role}).length;
  }
}

module.exports = Finder;
