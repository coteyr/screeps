/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:39:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-18 01:32:58
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

Room.prototype.refreshData = function() {
  if(this.memory.refresh_count <= 0 || !this.memory.refresh_count) {
    this.memory.refresh_count = 500;
    this.resetMemory();
    Memory.stats["room." + this.name + ".idlers"] = 0
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

Room.prototype.addHarvest = function(room_name) {
  this.addExoTarget('harvest', room_name)
}
Room.prototype.addReserve = function(room_name) {
  this.addExoTarget('reserve', room_name)
}

Room.prototype.addBuild = function(room_name) {
  this.addExoTarget('build', room_name)
}

Room.prototype.addAttack = function(room_name) {
  this.addExoTarget('attack', room_name)
}

Room.prototype.addSteal = function(room_name) {
  this.addExoTarget('steal', room_name)
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
  if(this.memory.report_count <= 0 || !this.memory.refresh_count) {
    this.memory.report_count = 10;
    console.log('<span style="color: #E6DB74;">Report for room: ' + this.name +'</span>')
    console.log('<span style="color: #E6DB74;">=======================</span>')
    console.log('<span style="color: #95CA2D;">Primary Energy: ' + this.energyAvailable + " of " + this.energyCapacityAvailable)
  }
  this.memory.report_count -= 1;
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
  return this.controller && this.controller.my && _.size(this.find(FIND_STRUCTURES, {filter: {structureType: 'container'}})) >= this.sourceCount()
}
