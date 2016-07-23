/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:39:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-23 08:20:58
*/

'use strict';


Room.prototype.tick = function() {
  Log.debug('Ticking Room: ' + this.name + ": " + this.memory.refresh_count);
  this.refreshData();
  this.tickStuff();
  /*this.tickExtensions();
  this.tickContainers();
  this.tickStorages();
  this.tickSpawns();
  this.tickTowers() */
  this.tickCreeps(); //keep this separate
  this.cleanPaths();
  this.report();
  return true;
};
Room.prototype.tickStuff = function() {
  var stuff = _.union({}, this.memory.my_storages, this.memory.my_containers, this.memory.my_extensions, this.memory.my_spawns, this.memory.my_towers)
  Object.keys(stuff).forEach(function(key, index) {
    var object = Game.getObjectById(this[key].id);
    if(object) {
      object.tick();
    }
  }, stuff);
}

Room.prototype.tickCreeps = function() {
  var me = this;
  _.filter(Game.creeps).forEach(function(creep) {
    if(creep.my && creep.room.name === me.name) {
      global.logUsedCPU(creep)
      creep.tick();
    }
  });
}

Room.prototype.exoOperations = function() {
  return this.energyCapacityAvailable >= 1300
}

Room.prototype.resetMemory = function() {
  var spawns = this.find(FIND_MY_SPAWNS);
  this.memory.my_spawns = spawns;
  var extensions = this.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}})
  this.memory.my_extensions = extensions
  var containers = this.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}})
  this.memory.my_containers = containers
  var towers = this.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}})
  this.memory.my_towers = towers
  var storages = this.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}})
  this.memory.my_storages = storages
  this.findSourceSpots();
}

Room.prototype.cleanPaths = function() {
  var keys = Object.keys(this.memory.paths);
  keys.forEach((key) => {
    var val = this.memory.paths[key];
    if(val.last_used < Game.time - 200) {
      delete this.memory.paths[key]
    }
  });
}

Room.prototype.refreshData = function() {
  if(this.memory.refresh_count <= 0 || !this.memory.refresh_count) {
    this.memory.refresh_count = 500;
    this.resetMemory();
    Memory.stats["room." + this.name + ".idlers"] = 0
    this.clearPaths()
  }
  this.memory.refresh_count -= 1;
}

Room.prototype.reset = function() {
  this.memory.refresh_count = -1;
}

Room.prototype.findSourceSpots = function() {
  var room = this;
  if(!room.memory.sources || _.size(room.memory.sources) === 0) {
    delete room.memory.sources
    var sources = room.find(FIND_SOURCES);
    var count = 0;
    var out = {}
    sources.forEach(function(source) {
      count += 1
      source['taken'] = false
      out[count] = source
    });
    room.memory.sources = out
  }
}

Room.prototype.myCreeps = function() {
  return this.find(FIND_MY_CREEPS);
}

Room.prototype.cleanCreeps = function() {
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }
}

Room.prototype.addExoTarget = function(arrayName, target) {
  var array = this.memory[arrayName] || []
  array.push(target)
  this.memory[arrayName] = array
}
Room.prototype.removeExoTarget = function(arrayName, target) {
  var array = this.memory[arrayName] || []
  for(var i = array.length - 1; i >= 0; i--) {
    if(array[i] === target) {
       array.splice(i, 1);
    }
  }
  this.memory[arrayName] = array
}

Room.prototype.addHarvest = function(room_name) {
  this.addExoTarget('harvest', room_name)
}
Room.prototype.addReserve = function(room_name) {
  this.addExoTarget('reserve', room_name)
}
Room.prototype.addClaim = function(room_name) {
  this.addExoTarget('claim', room_name)
}
Room.prototype.removeHarvest = function(room_name) {
  this.removeExoTarget('harvest', room_name)
}
Room.prototype.addBuild = function(room_name) {
  this.addExoTarget('build', room_name)
}

Room.prototype.addAttack = function(room_name) {
  this.addExoTarget('attack', room_name)
}

Room.prototype.removeAttack = function(room_name) {
  this.removeExoTarget('attack', room_name)
}

Room.prototype.removeSteal = function(room_name) {
  this.removeExoTarget('steal', room_name)
}

Room.prototype.addSteal = function(room_name) {
  this.addExoTarget('steal', room_name)
}

Room.prototype.addCarry = function(room_name) {
  this.addExoTarget('carry', room_name)
}

Room.prototype.addMine = function(room_name) {
  this.addExoTarget('mine', room_name)
}

Room.prototype.removeCarry = function(room_name) {
  this.removeExoTarget('carry', room_name)
}

Room.prototype.removeMine = function(room_name) {
  this.removeExoTarget('mine', room_name)
}

Room.prototype.list = function(arrayName) {
  var array = this.memory[arrayName] || []
  console.log('<span style="#00FFFF">Values for ' + arrayName + "</span>")
  array.forEach(function(value){
    console.log('<span style="#00FFFF">' + value + '</span>')
  })
}

Room.prototype.report = function() {
  var roomName = this.name
  Report.addRoomValue(this.name, 'energyAvailable', this.energyAvailable)
  Report.addRoomValue(this.name, 'energyCapacityAvailable', this.energyCapacity)
  var array =['harvester', 'builder', 'carrier', 'miner', 'upgrader']
  array.forEach(function(role){
    Report.addRoomValue(roomName, role + 'Count', Finder.findCreeps(role, roomName).length)
  })
  if (this.controller && this.controller.my) {
    Report.addRoomValue(this.name, 'level', this.controller.level)
    Report.addRoomValue(this.name, 'progress', this.controller.progress)
    Report.addRoomValue(this.name, 'progressTotal', this.controller.progressTotal)
  }
}

Room.prototype.energyCapacity = function() {
  if(Finder.findCreeps('miner', this.name).length <= 0 && Finder.findCreeps('harvester', this.name).length <= 0) {
    return 300
  } else {
    return this.energyCapacityAvailable
  }

}

Room.prototype.needsConstruction = function() {
  return _.size(this.find(FIND_CONSTRUCTION_SITES)) > 0
}

Room.prototype.sourceCount = function() {
  return _.size(this.find(FIND_SOURCES))
}

Room.prototype.carrierReady = function() {
  return _.size(this.find(FIND_STRUCTURES, {filter: {structureType: 'container'}})) >= this.sourceCount()
}

Room.prototype.getExitTo = function(roomName) {
  if(!this.memory['exit_from_' + this.name + "_to_" + roomName]) {
    this.memory['exit_from_' + this.name + "_to_" + roomName] = this.findExitTo(roomName)
  }
  return this.memory['exit_from_' + this.name + "_to_" + roomName]
}

Room.prototype.clearPaths = function() {
  Log.info('Clearing Path Cache for ' + this.name)
  delete this.memory.paths
  this.memory.paths = {}
}
