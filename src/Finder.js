/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-09 05:37:35
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-03 06:03:52
*/

'use strict';

var Finder = {
  findCreeps: function(role, roomName) {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role && creep.room.name === roomName && !creep.modeIs('recycle') && creep.ticksToLive >= 300);
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
  },
  findLargestSource: function(roomName) {
    var room = Game.rooms[roomName]
    var largest = null;
    if(room.memory.my_sources) {
      room.memory.my_sources.forEach(function(position) {
        position = Game.getObjectById(position.id)
        if(!largest) {
          largest = position
        }
        if(position.energy > largest.energy) {
          largest = position;
        }
      })
    }
    return largest;
  },
  findDropedEnergy: function(roomName) {
    var room = Game.rooms[roomName]
    var dropped = room.find(FIND_DROPPED_RESOURCES, {filter: function(r) {
      return r.resourceType === 'energy'
    }})
    return dropped
  },
  findMineral: function(roomName){
    var room = Game.rooms[roomName]
    return room.find(FIND_MINERALS)[0]
  },
  findDropedMinirals: function(roomName) {
    var room = Game.rooms[roomName]
    return room.find(FIND_DROPPED_RESOURCES, {filter: function(r) {
      return r.resourceType !== RESOURCE_ENERGY
    }})
  },
  findResouceCache: function(roomName, pos) {
    var room = Game.rooms[roomName]
    var objects = []
    _.union({}, room.memory.my_containers).forEach(function(value) {
      objects.push(Game.getObjectById(value.id));
    })
    var buffer = pos.findClosestByRange(objects, {filter: function(object) {
      var structure = Game.getObjectById(object.id)
        return structure.structureType === 'container' && structure.storedResources() >= 100
    }});
    return buffer;
  },
  findStorage: function(roomName) {
    var room = Game.rooms[roomName]
    return room.memory.my_storages[0]
  }

}

module.exports = Finder;
