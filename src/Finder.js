/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-09 05:37:35
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-24 17:52:37
*/

'use strict';

var Finder = {
  box: function(room, key, objects) {
    var array = []
    objects.forEach(function(o){
      array.push(o.id)
    })
    Memory[room.name + '-' + key] = array
  },
  unbox: function(room, key) {
    var objects = []
    try {
      Memory[room.name + '-' + key].forEach(function(o){
        var thing = Game.getObjectById(o)
        if(thing) objects.push(thing)
      })
      return objects
    } catch(err) {
      Finder.findAll(room, true)
    }
  },
  findEachTick: function(room) {
    var creeps = room.find(FIND_CREEPS)
    var objs = _.filter(creeps, function(c) { return c.my })
    this.box(room, 'my-creeps', objs)
    objs = _.filter(creeps, function(c) { return !c.my })
    this.box(room, 'hostile-creeps', objs)
    objs = room.find(FIND_CONSTRUCTION_SITES)
    this.box(room, 'construction-sites', objs)
    objs = room.find(FIND_DROPPED_RESOURCES)
    this.box(room, 'dropped-resources', objs)
  },
  findAll: function(room, force = false) {
    //if(!room.memory.objects) room.memory.objects = {}
    this.findEachTick(room)
    if(Game.time % 100 === 0 || force) { //infrequent
      var objs = room.find(FIND_STRUCTURES)
      this.box(room, 'structures', objs)
      objs = room.find(FIND_FLAGS)
      this.box(room, 'flags', objs)
    }
    if(Game.time % 5000 === 0 || force) { //almost never
     this.box(room, 'my-spawns', room.find(FIND_MY_SPAWNS))
     this.box(room, 'hostile-spawns', room.find(FIND_HOSTILE_SPAWNS))
     this.box(room, 'sources', room.find(FIND_SOURCES))
     this.box(room, 'minerals', room.find(FIND_MINERALS))
    }
   /* FIND_CREEPS: 101,
    FIND_CONSTRUCTION_SITES: 111,
    FIND_DROPPED_RESOURCES: 106,


    FIND_STRUCTURES: 107,
    FIND_FLAGS: 110,

    FIND_MY_SPAWNS: 112,
    FIND_HOSTILE_SPAWNS: 113,
    FIND_SOURCES: 105,*/

  },
  findCreeps: function(role, roomName) {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role && creep.memory.home === roomName && !creep.modeIs('recycle') && creep.ticksToLive >= 300 && !creep.memory.er);
    //var room = Game.rooms[room]
    //room.objects[my-creeps
  },
  findRealCreeps: function(role, roomName) {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role && creep.memory.home === roomName);
  },
  findAllCreeps: function(role) {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role);
  },
  findPresentCreepCount: function(roomName) {
    return _.size(_.filter(Game.creeps, (creep) => creep.room.name == roomName));
  },
  findHostileCreepCount: function(roomName) {
    var room = Game.rooms[roomName]
    if(room) return _.size(this.unbox(room, 'hostile-creeps'))
  },
  findRealCreepCount: function(role, spawn) {
    return _.size(_.filter(Game.creeps, (creep) => creep.memory.role === role && creep.memory.home === spawn.room.name && !creep.modeIs('recycle') && creep.ticksToLive >= 150));
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
  findCreepCountAssignedToRoom: function(role, roomName, sourceRoomName) {
    return _.size(Finder.findExoCreepAssignedToTarget(role, roomName, sourceRoomName)) + _.size(_.filter(Memory.spawn_queue, {'role': role, target: roomName, room: sourceRoomName}))
  },
  findExoCreepAssignedToTarget: function(role, targetRoomName, sourceRoomName) {
    return        _.filter(Game.creeps, (creep) => creep.memory.role === role && creep.memory.exo_target === targetRoomName && creep.memory.home == sourceRoomName) // && creep.ticksToLive > REMOTE_RECYCLE_AGE)
  },
  findSquad: function(roomName){
    return _.filter(Game.creeps, function(c){
      return c.room.name === roomName && c.isExoCreep() && (c.memory.role === 'exo-attacker' || c.memory.role === 'exo-tank' || c.memory.role === 'exo-healer')
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
    var sources = this.unbox(room, 'sources')
    sources.forEach(function(s){
      if(!largest) largest = s
      if(s.energy > largest.energy) largest = s
    })
    return largest;
  },
  findExclusiveDropedEnergy: function(roomName) {
    var room = Game.rooms[roomName]
    var dropped = _.filter(Finder.unbox(room, 'dropped-resources'), (r) => r.resourceType === RESOURCE_ENERGY && r.amount > 300)
    var result
    dropped.some(function(blob){
      var creeps = _.filter(Game.creeps, (creep) => creep.memory.target === blob.id);
      if(_.size(creeps) <= 0){
        result = blob
        return true
      }
    })
    return result
  },
  findDropedEnergy: function(roomName) {
    var room = Game.rooms[roomName]
    var dropped = _.filter(this.unbox(room, 'dropped-resources'), (r) => r.resourceType === RESOURCE_ENERGY && r.amount > 300)
    return dropped
  },
  findMineral: function(roomName){
    var room = Game.rooms[roomName]
    var minirals = _.first(this.unbox(room, 'minerals'))
    return minirals
  },
  findDropedMinirals: function(roomName) {
    var room = Game.rooms[roomName]
    var minirals = _.filter(this.unbox(room, 'dropped-resources'), (r) => r.resourceType !== RESOURCE_ENERGY)
    return minirals
  },
  findResouceCache: function(roomName, pos) {
    var room = Game.rooms[roomName]
    var caches = _.filter(this.unbox(room, 'structures'), (s) => s.structureType === STRUCTURE_CONTAINER && s.storedResources() >= 100)
    return pos.findClosestByRange(caches)
  },
  findStorage: function(roomName) {
    var room = Game.rooms[roomName]
    return room.storage
  },
  findSourcePosition: function(roomName, role) {
    var room = Game.rooms[roomName]
    if(!room) return false
    var sources = _.filter(Finder.unbox(room, 'sources'), function(s){
      if(role === 'miner') {
        return _.size(_.filter(Finder.findCreeps('miner', roomName), (c) => c.memory.target === s.id)) <= 0
      } else {
        return s.energy >= 100 && _.size(_.filter(Game.creeps, (c) => c.room.name === roomName && c.memory.target === s.id)) < 2
      }
    })
  if (_.size(sources) > 0) return sources[0]
  },
  findHarvesterPosition: function(roomName, role) {
    var room = Game.rooms[roomName]
    if(!room) return false
    var result = null
    var biggest = 0
    var backup = null
    var used = 1000
    room.find(FIND_SOURCES).forEach(function(source){
      var creeps = _.filter(Game.creeps, (creep) => creep.memory.target === source.id);
      if(source.energy > biggest) {
        backup = source
        // May need to add some exclusive checking
        // This is a CPU HOG
        if(role === 'miner') {
          if(_.size(creeps) <= 0) {
            result = source
            biggest = source.energy
          }
        } else {
          var count = 0 //Finder.findSourcePositionCount(roomName)
          room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true).forEach(function(spot) {
            if (spot.terrain === 'plain' || spot.terrain === 'swamp') {
              count += 1;
            }
          })
          if(_.size(creeps) < count) {
            result = source
            biggest = source.energy
          }
        }
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
        if (spot.terrain === 'plain' || spot.terrain === 'swamp') {
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
  findContainerCount: function(roomName) {
    var room = Game.rooms[roomName]
    return _.size(_.filter(this.unbox(room, 'structures'), (s) => s.structureType === 'container'))
  },
  findSpawn: function(roomName){
    var room = Game.rooms[roomName]
    var target = room.find(FIND_MY_SPAWNS)
    if(_.size(target) > 0) return target[0]
  },
  hasHostals: function (roomName) {
    var room = Game.rooms[roomName]
    return _.size(room.find(FIND_HOSTILE_CREEPS)) > 0
  },
  findRoads: function(roomName) {
    var room = Game.rooms[roomName]
    return _.filter(this.unbox(room, 'structures'), (s) => s.structureType === STRUCTURE_ROAD)
  },
  findFlags: function(roomName) {
    var room = Game.rooms[roomName]
    var flags = this.unbox(room, 'flags')
    if(_.size(flags) === 0) {
      var objs = room.find(FIND_FLAGS)
      this.box(room, 'flags', objs)
      flags = objs
    }
    return flags
  },
  findTowers: function(roomName) {
    var room = Game.rooms[roomName]
    return _.filter(this.unbox(room, 'structures'), function(s){ return s.structureType === STRUCTURE_TOWER })
  },
  findExtensions: function(roomName) {
    var room = Game.rooms[roomName]
    return _.filter(this.unbox(room, 'structures'), function(s){ return s.structureType === STRUCTURE_EXTENSION })
  },
  findStructures: function(roomName, structureType) {
    var room = Game.rooms[roomName]
    return _.filter(this.unbox(room, 'structures'), function(s){ return s.structureType === structureType })
  },
  findHostileStructures: function(roomName) {
    var room = Game.rooms[roomName]
    return _.filter(this.unbox(room, 'structures'), function(s){ return s.my === false && s.structureType != STRUCTURE_ROAD && s.structureType != STRUCTURE_CONTROLLER})
  },
  findStructure: function(roomName, structureType) {
   return _.first(this.findStructures(roomName, structureType))
  },
  findLabs: function(roomName) {
    return this.findStructures(roomName, STRUCTURE_LAB)
  },
  findLinks: function(roomName) {
    return this.findStructures(roomName, STRUCTURE_LINK)
  },
  findReceivingLink: function(roomName) {
    let links = _.filter(this.findStructures(roomName, STRUCTURE_LINK), function(l){return l.receiver() && l.cooldown <= 0 && !l.isFull()})
    if(_.size(links) >= 1) return links[0]
  },
  findConstructionSites: function(roomName) {
    var room = Game.rooms[roomName]
    return _.filter(this.unbox(room, 'construction-sites'), function(s){ return s.my })
  },
  findHostiles: function(roomName) {
    var room = Game.rooms[roomName]
    if(room) return this.unbox(room, 'hostile-creeps')
  },
  findRamparts: function(roomName) {
    return false
  }




}

module.exports = Finder;
