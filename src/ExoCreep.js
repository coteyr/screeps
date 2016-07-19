/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-14 19:31:34
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-18 00:52:22
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
    this.assignTravelTasks()

  }

}

Creep.prototype.assignTravelTasks = function() {
  var functionName = ("assign_travel_" + this.memory.role + "_tasks").toCamel()
  Caller(this, functionName)
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

Creep.prototype.doTransition = function() {
  var roomName = this.memory.old_room
  if (this.room.name !== roomName) {
    Log.info('####3')
    if(this.move(this.memory.exit_dir) === 0) {
      Log.info('$$$$$$$$$$')
      this.setMode('idle');
      delete this.memory.exit_dir
      delete this.memory.exit
      delete this.memory.goto_room
      delete this.memory.old_room
    }
  } else {
    this.move(this.memory.exit_dir)
  }
}

Creep.prototype.gotoRoom = function(roomName) {
  if(!this.memory.exit) {
    var exitDir = this.room.findExitTo(roomName);
    var exit = this.pos.findClosestByRange(exitDir);
    this.memory.exit = exit
    this.memory.exit_dir = exitDir
    this.memory.old_room = this.room.name
  }
  if(this.memory.exit && this.moveCloseTo(this.memory.exit.x, this.memory.exit.y, 1)) {
    this.moveTo(this.memory.exit.x, this.memory.exit.y)
    this.memory.goto_room = roomName
    this.setMode('transition')
    delete this.memory.exit
    // delete this.memory.exit_dir
  }
}
