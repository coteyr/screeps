/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-14 19:31:34
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-12 23:12:40
*/

'use strict';

let ExoCreep = function(){};

StructureSpawn.prototype.setExoCount = function(role){
   this.memory['current-' + role] = Finder.findExoCreepCount(role, this, this.room.name)
}

StructureSpawn.prototype.setMaxExoCount = function(role, arrayName) {
  if (!role) {
    Log.error('Can not find role: ' + role)
    return 0;
  }
  var functionName = ("get_" + role + '_multi').toCamel()
  var max = eval('EXOROLES.' + functionName + '(this.room)')
  this.memory['max-' + role] = (max * _.size(this.room.memory[arrayName]))
  return this.memory['max-' + role]
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
  if(this.mode() != 'transition' && this.mode() != 'leave' && this.mode() !== 'respond') {
    this.getOffExits()
  }
  if(this.room.name === this.memory.home && this.ticksToLive <= 300) {
    this.setMode('recycle')
  } else if(this.room.name === this.memory.exo_target) {
    // I am in the remote room
    this.assignRemoteExoTasks()
  } else if(Object.prototype.toString.call( this.memory.exo_target ) === '[object Array]' && this.room.name === this.memory.exo_target[_.size(this.memory.exo_target) - 1]) {
    this.assignRemoteExoTasks()

  } else if (this.room.name === this.memory.home) {
    this.assignHomeExoTasks()
    // I am home
  } else {
    // I have no clue where I am
    this.assignTravelTasks()

  }

}

Creep.prototype.getOffExits = function() {
  if(!this.modeIs('move-out')) {
  if(this.pos.y >= 47) {
    this.move(TOP)
    return false
  }
  if (this.pos.x >= 47) {
    this.move(LEFT)
    return false
  }
  if (this.pos.y <= 3) {
    this.move(BOTTOM)
    return false
  }
  if (this.pos.x <= 3) {
    this.move(RIGHT)
    return false
  }
  }
  return true
}


Creep.prototype.assignTravelTasks = function() {
  if(!this.modeIs('transition')){
    var functionName = ("assign_travel_" + this.memory.role + "_tasks").toCamel()
    Caller(this, functionName)
  }
}

Creep.prototype.assignRemoteExoTasks = function() {
  if(!this.modeIs('transition')){
    var functionName = ("assign_remote_" + this.memory.role + "_tasks").toCamel()
    Caller(this, functionName)
  }
}

Creep.prototype.assignHomeExoTasks = function() {
  if(!this.modeIs('transition')){
    var functionName = ("assign_home_" + this.memory.role + "_tasks").toCamel()
    Caller(this, functionName)
  }
}

Creep.prototype.setupExoMemory = function() {
  var functionName = ("setup_" + this.memory.role + "_memory").toCamel()
  Caller(this, functionName)
  if(this.mode() != 'transition') {
    delete this.memory.exit_dir
    delete this.memory.exit
  }
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
  if(_.size(this.pos.findInRange(FIND_CREEPS), 1) >= 3) {
    this.move(BOTTOM) // maybe don't hard code
  } else {
  if (this.room.name !== roomName) {
    if(this.move(this.memory.exit_dir) === 0) {
      this.setMode('idle');
      delete this.memory.exit_dir
      delete this.memory.exit
      delete this.memory.goto_room
      delete this.memory.old_room
    }
  } else {
    if (this.memory.exit) {
      if(this.pos.x > this.memory.exit.x) {
        this.move(LEFT)
      } else if(this.pos.x < this.memory.exit.x) {
        this.move(RIGHT)
      } else if(this.pos.y > this.memory.exit.y) {
        this.move(BOTTOM)
      } else if(this.pos.y < this.memory.exit.y) {
        this.move(TOP)
      }
    } else {
      this.move(this.memory.exit_dir)
    }
  }
  }
}

Creep.prototype.gotoRoom = function(roomName) {
  if(!this.memory.waypoints && Memory.waypoints[this.room.name + "-to-" + roomName]) {
    this.memory.waypoints = Memory.waypoints[this.room.name + "-to-" + roomName]
  }
  if(!this.memory.waypoints && Memory.waypoints[roomName+ "-to-" + this.room.name]) {
    this.memory.waypoints = Memory.waypoints[roomName + "-to-" + this.room.name]
  }
  if(this.memory.waypoints && this.memory.waypoints[0] === this.room.name) {
    this.memory.waypoints.shift()
    if(_.size(this.memory.waypoints) <= 0) {
      delete this.memory.waypoints
    }
  } else if(this.memory.waypoints && this.memory.waypoints[0] !== roomName) {
    this.gotoRoom(this.memory.waypoints[0])
    return true
  }  else {
    if(!this.memory.exit) {
      var exitDir = this.room.getExitTo(roomName);
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

}
