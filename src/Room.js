/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:39:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-12-13 00:13:23
*/

'use strict';


Room.prototype.tick = function() {
  if(!Memory.stats) Memory.stats = {}
  Finder.findAll(this)
  Log.debug('Ticking Room: ' + this.name + ": " + this.memory.refresh_count);
  // this.clearMiningSpots();
  // this.refreshData();
  this.tickStuff();
  this.tickCreeps(); //keep this separate
  this.shields();
  if(Game.time % 1500 == 0) this.memory.energy_spent_on_walls = 0
  Memory.stats["room." + this.name + ".energyAvailable"] = this.energyAvailable
  return true;
};
Room.prototype.upgradeWalls = function() {
  if(!this.memory.energy_spent_on_walls) this.memory.energy_spent_on_walls = 0
  if(this.needsConstruction()) return false
  // return this.memory.energy_spent_on_walls < 500
  return true
}
Room.prototype.tickStuff = function() {
  var stuff = _.union({}, this.memory.my_storages, this.memory.my_containers, this.memory.my_extensions, this.memory.my_spawns, this.memory.my_towers, this.memory.my_sources, this.memory.my_links)
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
  var sources = this.find(FIND_SOURCES)
  this.memory.my_sources = sources
  var links = this.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}})
  this.memory.my_links = links
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
    // this.clearPaths()
  }
  this.memory.refresh_count -= 1;
}

Room.prototype.reset = function() {
  this.memory.refresh_count = -1;
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

Room.prototype.clearMiningSpots = function() {
  this.find(FIND_SOURCES).forEach(function(source){
    source.pos.findInRange(FIND_MY_CREEPS, 1).forEach( function(creep) {
      if(creep.modeIs('idle')) creep.move(Memory.dance_move)
    })
  })
}

Room.prototype.addExoTarget = function(arrayName, target) {
  var array = this.memory[arrayName] || []
  array.push(target)
  this.memory[arrayName] = array
  global.listGoals()
}
Room.prototype.removeExoTarget = function(arrayName, target) {
  var array = this.memory[arrayName] || []
  for(var i = array.length - 1; i >= 0; i--) {
    if(array[i] === target) {
       array.splice(i, 1);
    }
  }
  this.memory[arrayName] = array
  global.clearSpawnQueue()
  global.listGoals()
}

Room.prototype.addHarvest = function(room_name) {
  this.addExoTarget('harvest', room_name)
}
Room.prototype.addReserve = function(room_name) {
  this.addExoTarget('reserve', room_name)
}
Room.prototype.removeReserve = function(roomName) {
  this.removeExoTarget('reserve', roomName)
}
Room.prototype.addClaim = function(room_name) {
  this.addExoTarget('claim', room_name)
}
Room.prototype.removeHarvest = function(room_name) {
  this.removeExoTarget('harvest', room_name)
}
Room.prototype.removeClaim = function(room_name) {
  this.removeExoTarget('claim', room_name)
}
Room.prototype.addBuild = function(room_name) {
  this.addExoTarget('build', room_name)
}
Room.prototype.removeBuild = function(roomName){
  this.removeExoTarget('build', roomName)
}

Room.prototype.addScout = function(roomName) {
  this.addExoTarget('scout', roomName)
}

Room.prototype.removeScout = function(roomName) {
  this.removeExoTarget('scout', roomName)
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

Room.prototype.addResponder = function(room_name) {
  this.addExoTarget('responder', room_name)
}

Room.prototype.removeResponder = function(room_name) {
  this.removeExoTarget('responder', room_name)
}

Room.prototype.addSapper = function(room_name) {
  this.addExoTarget('sapper', room_name)
}

Room.prototype.removeSapper = function(room_name) {
  this.removeExoTarget('sapper', room_name)
}

Room.prototype.addReaper = function(room_name) {
  this.addExoTarget('reap', room_name)
}

Room.prototype.removeReaper = function(room_name) {
  this.removeExoTarget('reap', room_name)
}

Room.prototype.addUpgrade = function(room_name) {
  this.addExoTarget('upgrade', room_name)
}

Room.prototype.removeUpgrade = function(room_name) {
  this.removeExoTarget('upgrade', room_name)
}

Room.prototype.list = function(arrayName) {
  var array = this.memory[arrayName] || []
  console.log('<span style="#00FFFF">Values for ' + arrayName + "</span>")
  array.forEach(function(value){
    console.log('<span style="#00FFFF">' + value + '</span>')
  })
}

Room.prototype.report = function() {

}

Room.prototype.energyCapacity = function() {
  //if(Finder.findCreeps('miner', this.name).length <= 0 && Finder.findCreeps('harvester', this.name).length <= 0 && Finder.findCreeps('big-miner', this.name).length <= 0) {
  //  return 300
  //} else {
    //if (this.energyCapacityAvailable > 2300) {
    //  return this.energyCapacityAvailable * 0.783
    //} else {
      return this.energyCapacityAvailable
   // }
  //}

}

Room.prototype.needsConstruction = function() {
  return _.size(Finder.findConstructionSites(this.name)) > 0
}

Room.prototype.sourceCount = function() {
  //return Finder.findSourcePositionCount(this.name)
  return Finder.findSourceCount(this.name)
}

Room.prototype.carrierReady = function() {
  return Finder.findContainerCount(this.name) >= Finder.findSourceCount(this.name)
}

Room.prototype.getExitTo = function(roomName) {
  if(!this.memory['exit_from_' + this.name + "_to_" + roomName]) {
    this.memory['exit_from_' + this.name + "_to_" + roomName] = this.findExitTo(roomName)
  }
  return this.memory['exit_from_' + this.name + "_to_" + roomName]
}

/*Room.prototype.clearPaths = function() {
  Log.info('Clearing Path Cache for ' + this.name)
  delete this.memory.paths
  this.memory.paths = {}
}*/

Room.prototype.needsDemolition = function() {
  return _.size(this.memory.demos) > 0
}

Room.prototype.addDemo = function(id) {
  if(!this.memory.demos) {
    this.memory.demos = []
  }
  this.memory.demos.push(id)
}
Room.prototype.removeDemo = function(id) {
  this.removeExoTarget('demos', id)
}

Room.prototype.excavatorReady = function() {
  if(this.controller.level >= 6) {
    var min = Finder.findMineral(this.name)
    if(min && min.mineralAmount > 0) {
      if(Finder.findStructure(this.name, STRUCTURE_EXTRACTOR)) {
        return true
      }
    }
  }
  return false
}

Room.prototype.isFull = function() {
  return this.energyAvailable >= this.energyCapacity()
}

Room.prototype.hasRoom = function() {
  return !this.isFull()
}

Room.prototype.setTactic = function(value) {
  this.memory.tactic = value
  global.clearSpawnQueue()
}

Room.prototype.tactic = function() {
  if(!this.memory.tactic) this.memory.tactic = "Drain Tower"
  return this.memory.tactic
}

Room.prototype.hasTactic = function() {
  if(!this.memory.tactic) return false
  return true
}

Room.prototype.maxEnergy = function() {
  return Finder.findSourceCount(this.name) * 3000
}

Room.prototype.hasRoads = function() {
  return _.size(Finder.findRoads(this.name)) > 5
}

Room.prototype.hasHostiles = function() {
  return _.size(Finder.findHostiles(this.name)) > 0
}

Room.prototype.findAPath = function(from, to) {
  return this.findPath(from, to, {ignoreCreeps: true, ignoreRoads: true, serialize: true})
}

Room.prototype.addSellOrder = function(resource, amount) {
  if(!this.memory.sell) this.memory.sell = {}
  if(!this.memory.sell[resource]) this.memory.sell[resource] = {total: 0, id: null, cost: 0, state: null}
  this.memory.sell[resource].total += amount
  global.listSales()
}
Room.prototype.needs = function(role, sourceRoom) {
  return ROLES.roomNeeds[role.toCamel()](sourceRoom, this.name)
}
Room.prototype.has = function(role,  sourceRoomName) {
  return Finder.findCreepCountAssignedToRoom(role, this.name, sourceRoomName)
}

Room.prototype.shields = function() {
  if(Finder.findPresentCreepCount(this.name) <= 0 && Finder.findHostileCreepCount(this.name) >= 1) {
    // return this.controller && this.controller.activateSafeMode()
  }
}
Room.prototype.strategyIs = function(testStrategy) {
  if(!this.strategy()) this.setStrategy('Objects')
  return this.strategy() === testStrategy.toLowerCase()
}
Room.prototype.strategy = function() {
  if(this.memory.strategy) return this.memory.strategy.toLowerCase()
}
Room.prototype.setStrategy = function(strategy) {
  let room = this
  this.memory.strategy = strategy.toLowerCase()
  if(this.strategyIs('Objects')) {
    for(var name in Memory.creeps) {
      var creep = Memory.creeps[name]
      if(creep && creep.home == room.name) {
        creep.target = this.name
        creep.role = 'harvester'
        creep.state = null
      }
    }
  }
  return strategy.toLowerCase()
}
Room.prototype.addWaypoint = function(x, y, name=null) {
  this.createFlag(x, y, name, COLOR_ORANGE, COLOR_RED)
}
Room.prototype.clearWaypoints = function() {
  let roomName = this.name
  Object.keys(Game.flags).forEach(function(key) {
    let flag = Game.flags[key]
    if (flag.color == COLOR_ORANGE && flag.secondaryColor == COLOR_RED && flag.room.name == roomName) flag.remove()
  })
}
