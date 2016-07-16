/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-14 19:31:34
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-15 22:07:37
*/

'use strict';

let ExoCreep = function(){};

StructureSpawn.prototype.setExoCount = function(role){
   this.memory['current-' + role] = Finder.findExoCreepCount(role, this, this.room.name)
}

StructureSpawn.prototype.setMaxExoCount = function(role, arrayName, multiplyer) {
  if(this.room.exoOperations() && this.room.memory[arrayName]) {
    this.memory["max-" + role] = _.size(this.room.memory[arrayName]) * multiplyer
  } else {
    this.memory["max-" + role] = 0
  }
}

StructureSpawn.prototype.getExoCount = function(role) {
  // return this.memory['current-' + role] || Finder.findExoCreepCount(role, this, this.room.name)
  return Finder.findExoCreepCount(role, this, this.room.name)
}

StructureSpawn.prototype.getMaxExoCount = function(role) {
  return this.memory["max-" + role] || 0
}

StructureSpawn.prototype.spawnExoCreep = function(role, body, priority) {
  this.addToSpawnQueue(role, body, priority)
}

Creep.prototype.assignExoTasks = function() {
  this.setupExoMemory()
  if(this.room.name === this.memory.exo_target) {
    // I am in the remote room
    this.assignRemoteExoTasks()
  } else if (this.room.name === this.memory.home) {
    this.assignHomeExoTasks()
    // I am home
  } else {
    // I have no clue where I am

  }

}

Creep.prototype.assignRemoteExoTasks = function() {
  var functionName = ("assign_remote_" + this.memory.role + "_tasks").toCamel()
  Caller(this, functionName)
}

Creep.prototype.assignHomeExoTasks = function() {
  var functionName = ("assign_home_" + this.memory.role + "_tasks").toCamel()
  Caller(this, functionName)
}

Creep.prototype.setupExoMemory = function() {
  var functionName = ("setup_" + this.memory.role + "_memory").toCamel()
  Caller(this, functionName)
}

Creep.prototype.chooseExoTarget = function(arrayName) {
  if(!this.memory.exo_target) {
    var choice = this.room.memory["last_" + arrayName + "_choice"] || 0
    if (_.size(this.room.memory[arrayName]) > 0) {
      this.memory.exo_target = this.room.memory[arrayName][choice]
    }
    choice += 1
    if(choice > _.size(this.room.memory[arrayName]) - 1) {
      choice = 0
    }
    this.room.memory["last_" + arrayName + "_choice"] = choice
  }
}

Creep.prototype.doGoHome = function() {
  this.gotoRoom(this.memory.home)
}
