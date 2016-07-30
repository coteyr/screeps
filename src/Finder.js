/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-09 05:37:35
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-29 16:48:39
*/

'use strict';

var Finder = {
  findCreeps: function(role, roomName) {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role && creep.room.name === roomName);
  },
  findAllCreeps: function(role) {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role);
  },
  findRealCreepCount: function(role, spawn) {
    return _.size(Finder.findCreeps(role, spawn.room.name));
  },
  findCreepCount: function(role, spawn) {
      return _.size(Finder.findCreeps(role, spawn.room.name)) + _.filter(spawn.memory.spawn_queue, {'role': role}).length;
  },
  findAllCreepCount: function(role, spawn) {
    return _.size(Finder.findAllCreeps(role)) + _.filter(spawn.memory.spawn_queue, {'role': role}).length;
  },
  findExoCreepCount: function(role, spawn, home) {
    return _.size(_.filter(Game.creeps, (creep) => creep.memory.role === role && creep.memory.home === home)) + _.size(_.filter(spawn.memory.spawn_queue, {'role': role}))
  },
  findMiningCreeps: function(id, roomName) {
    return _.filter(Game.creeps, function(c){
      return c.memory.assigned_position && c.memory.assigned_position.id === id && c.room.name === roomName && (c.role === 'miner' || c.role === 'exo-harvester' || c.role === 'harvester' || c.role === 'exo-miner')
    });
  }
}

module.exports = Finder;
