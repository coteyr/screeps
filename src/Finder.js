/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-09 05:37:35
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-20 16:05:09
*/

'use strict';

var Finder = {
  findCreeps: function(role, roomName) {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role && creep.memory.home === roomName && !creep.modeIs('recycle') && creep.ticksToLive >= 150);
  },
  findAllCreeps: function(role) {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role);
  },
  findRealCreepCount: function(role, spawn) {
    return _.size(Finder.findCreeps(role, spawn.room.name));
  },
  findCreepCount: function(role, spawn) {
      return _.size(Finder.findCreeps(role, spawn.room.name)) + _.filter(Memory.spawn_queue, {'role': role, room: spawn.room.name}).length;
  },
  findAllCreepCount: function(role, spawn) {
    return _.size(Finder.findAllCreeps(role)) + _.filter(spawn.memory.spawn_queue, {'role': role}).length;
  },
  findExoCreepCount: function(role, spawn, home) {
    return _.size(_.filter(Game.creeps, (creep) => creep.memory.role === role && creep.memory.home === home)) + _.size(_.filter(Memory.spawn_queue, {'role': role, room: spawn.room.name}))
  },
  findSquad: function(roomName){
    return _.filter(Game.creeps, function(c){
      return c.room.name == roomName && c.isExoCreep() && (c.memory.role === 'exo-attacker' || c.memory.role === 'exo-tank' || c.memory.role === 'exo-healer')
    });
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
      return r.resourceType === 'energy' && r.amount > 100
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
  },
  findSourcePosition: function(roomName, role) {
    var room = Game.rooms[roomName]
    var result = null
    var biggest = 0
    var backup = null
    var used = 1000
    room.find(FIND_SOURCES).forEach(function(source){
      var creeps = _.filter(Game.creeps, (creep) => creep.memory.target === source.id);
      if(source.energy > biggest) {

        // May need to add some exclusive checking
        // This is a CPU HOG
        if(role == 'miner') {

          if(_.size(creeps) <= 0) {
            result = source
            biggest = source.energy
          }
        } else {
          var count = 0
          room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true).forEach(function(spot) {
            if (spot.terrain == 'plain' || spot.terrain == 'swamp') {
              count += 1;
            }
          })
          var creeps = _.filter(Game.creeps, (creep) => creep.memory.target === source.id);
          if(_.size(creeps) < count) {
            result = source
            biggest = source.energy
          }
        }
      }
      if(_.size(creeps) <= used) {
        used = _.size(creeps)
        backup = source
      }
    })
    if(result) {
      return result
    } else {
      return backup
    }
  },
  findSourcePositionCount: function(roomName) {
    var room = Game.rooms[roomName]
    var count = 0
    room.find(FIND_SOURCES).forEach(function(source){
      room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true).forEach(function(spot) {
        if (spot.terrain == 'plain' || spot.terrain == 'swamp') {
          count += 1;
        }
      })
    })
    return count
  },
  findSourceCount: function(roomName) {
    var room = Game.rooms[roomName]
    return _.size(room.find(FIND_SOURCES))
  },
  findSpawn: function(roomName){
    var room = Game.rooms[roomName]
    var target = room.find(FIND_MY_SPAWNS)
    if(_.size(target) > 0) return target[0]
  },
  hasHostals: function (roomName) {
    var room = Game.rooms[roomName]
    return _.size(room.find(FIND_HOSTILE_CREEPS)) > 0
  }

}

module.exports = Finder;
