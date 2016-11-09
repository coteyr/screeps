/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-14 19:31:34
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-08 14:21:04
*/

'use strict';

let ExoCreep = function(){};

StructureSpawn.prototype.getExoCount = function(role, roomName) {
  // return this.memory['current-' + role] || Finder.findExoCreepCount(role, this, this.room.name)
  //return Finder.findExoCreepCount(role, this, this.room.name)
  //let room = Game.rooms[roomName]
  //if(room) {
  //  return room.has(role, this.room.name)
  //} else {
    return Finder.findCreepCountAssignedToRoom(role, roomName, this.room.name)
 // }

}

StructureSpawn.prototype.getMaxExoCount = function(role, scope, roomName) {
  //return this.memory["max-" + role] || 0
  /*var functionName = ("get_" + role.role + '_multi').toCamel()
  var multi = eval(scope + '.' + functionName + '(this.room)')
  var max = 0
  max += multi * _.size(this.room.memory[role.arrayName])
  return max*/
    let room = Game.rooms[roomName]
    if(room) {
      return room.needs(role.role, this.room)
    } else {
      var functionName = ("get_" + role.role + '_multi').toCamel()
      var multi = eval(scope + '.' + functionName + '(this.room)')
      var max = 0
      max += multi //* _.size(this.room.memory[role.arrayName])
      return max
    }
}
StructureSpawn.prototype.getMaxExoArmyCount = function(role, scope, roomName) {
  let room = Game.rooms[roomName]
  if(room) {
      return room.needs(role.role, this.room)
    } else {
      var multi = role.multiplyer
      var max = 0
      max += multi * _.size(this.room.memory[role.arrayName])
      return max
    }

}

Creep.prototype.assignExoTasks = function() {
  this.setupExoMemory()
  if(this.modeIs('idle')) this.clearTarget()
  if(this.mode() != 'transition' && this.mode() != 'leave' && this.mode() !== 'respond') {
    this.getOffExits()
  }
  // if(this.ticksToLive < REMOTE_RECYCLE_AGE && this.role !== 'exo-reserver' && this.role !== 'exo-claimer') this.setMode('recover')
  if (this.modeIs('recover')) {

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
  if(!this.modeIs('move-out') && !this.modeIs('attack') && !this.modeIs('build')) {
    if(this.pos.y >= 47 || this.pos.x >= 47 || this.pos.y <= 3 || this.pos.x <= 3) {
      this.moveCloseTo(25, 25, 10)
      return false
    }
    return true
  }
}


Creep.prototype.assignTravelTasks = function() {

  if(!this.modeIs('transition')){
    var functionName = ("assign_travel_" + this.memory.role + "_tasks").toCamel()
    Caller(this, functionName)
  }
}

Creep.prototype.assignRemoteExoTasks = function() {
  if(!this.modeIs('transition')){
    if(this.modeIs('transfer')) this.setMode('idle')
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
    delete this.memory.old_room
  }
  // this.recoverUnused()
}

Creep.prototype.recoverUnused = function() {
  var home = Game.rooms[this.memory.home]
  var target = this.memory.exo_target
  var arrayName = ''
  if(ARMY[home.tactic()] && ARMY[home.tactic()].roles[this.memory.role]) arrayName = ARMY[home.tactic()].roles[this.memory.role].arrayName
  var  roles = _.filter(ARMY[home.tactic()].roles, (r) => r.role == this.memory.role)
  if(_.size(roles) > 0) {
    var role = roles[0]
    if(_.indexOf(home.memory[role.arrayName], target) === -1){
      // no longer an option
      // this.setMode('recover')
    }
  }
}


Creep.prototype.chooseExoTarget = function(arrayName) {
  if(!this.memory.exo_target) {
    var choice = Game.rooms[this.memory.home].memory["last_" + arrayName + "_choice"] || 0
    if (_.size(Game.rooms[this.memory.home].memory[arrayName]) > 0) {
      this.memory.exo_target = Game.rooms[this.memory.home].memory[arrayName][choice]
    }
    choice += 1
    if(choice > _.size(Game.rooms[this.memory.home].memory[arrayName]) - 1) {
      choice = 0
    }
    Game.rooms[this.memory.home].memory["last_" + arrayName + "_choice"] = choice
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
      this.moveTo(this.memory.exit.x, this.memory.exit.y)
      /*if(this.pos.x > this.memory.exit.x) {
        this.move(LEFT)
      }
      if(this.pos.x < this.memory.exit.x) {
        this.move(RIGHT)
      }
       if(this.pos.y > this.memory.exit.y) {
        this.move(BOTTOM)
      }
      if(this.pos.y < this.memory.exit.y) {
        this.move(TOP)
      }*/
    } else {
      var exitDir = this.room.getExitTo(roomName);
      var exit = this.pos.findClosestByRange(this.memory.exit_dir);
      this.moveTo(exit)
    }
  }
  }
}

Creep.prototype.gotoRoom = function(roomName) {
 /* if(!Memory.waypoints) Memory.waypoints = {}
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
  }  else {*/
    var pos = new RoomPosition(25, 25, roomName);
    let flags = Finder.findFlags(this.room.name)
    if(_.size(flags) > 0) {
      this.moveCloseTo(flags[0].pos.x, flags[0].pos.y, 1)

      if(this.pos.getRangeTo(flags[0].pos) < 2) {
        this.memory.ignore_flags = true
        this.moveTo(pos)
      }
    } else {
      if(this.room.name != roomName) {
        this.moveTo(pos)
      }
    }
    if(this.memory.ignore_flags) {
      this.moveTo(pos)
    }
    /*if(!this.memory.exit) {
      var pos = new RoomPosition(25, 25, roomName);
      var exitDir = this.room.getExitTo(roomName);
      var exit = this.pos.findClosestByPath(exitDir);
      this.memory.exit = exit
      this.memory.exit_dir = exitDir
      this.memory.old_room = this.room.name
    }
    if(this.memory.exit && this.moveCloseTo(this.memory.exit.x, this.memory.exit.y, 1)) {
      this.moveTo(this.memory.exit.x, this.memory.exit.y)
      this.memory.goto_room = roomName
      this.setMode('transition')
      // delete this.memory.exit
      // delete this.memory.exit_dir
    }
  }*/

}

Creep.prototype.doLeave = function() {
  this.gotoRoom(this.memory.exo_target)
  this.clearTarget()
}

Creep.prototype.doRecover = function() {
  if(this.room.name == this.memory.home) {
    this.doRecycle()
  } else {
    this.gotoRoom(this.memory.home)
  }
}
