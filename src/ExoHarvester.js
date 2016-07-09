/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-09 13:53:12
*/

'use strict';

Creep.prototype.assignExoHarvesterTasks = function() {
  if(!this.memory.home) {
    this.memory.home = this.room.name
  }
  if(this.room.name === this.memory.harvest) {
    // I am in the remote room
    this.assignRemoteExoHarvesterTasks()
  } else if (this.room.name === this.memory.home) {
    this.assignHomeExoHarvesterTasks()
    // I am home
  } else {
    // I have no clue where I am

  }
  if(this.room.name === this.memory.home && this.carry.energy > 0) {
    this.setMode('transfer')
  }
  if(this.room.name === this.memory.home && this.memory.mode === 'mine') {
    this.setMode('idle')
  }
}

Creep.prototype.assignHomeExoHarvesterTasks = function() {
  if(this.carry.energy <= 0) {
    this.setMode('leave');
  } else {
    this.setMode('transfer');
  }
}

Creep.prototype.assignRemoteExoHarvesterTasks = function() {
  Log.info('here d')
  if(this.memory.mode == 'transition') {
    this.setMode('mine')
  }
  if (this.carry.energy < this.carryCapacity) {
    this.setMode('mine')
  } else if (this.carry.energy >= this.carryCapacity) {
    this.setMode('go-home')
  }
}

Creep.prototype.doLeave = function() {
  if(!this.memory.exit) {
    var exitDir = this.room.findExitTo(this.memory.harvest);
    Log.info(exitDir)
    var exit = this.pos.findClosestByRange(exitDir);
    this.memory.exit = exit
    this.memory.exit_dir = exitDir
  }
  if(this.memory.exit && this.moveCloseTo(this.memory.exit.x, this.memory.exit.y, 1)) {
    this.moveTo(this.memory.exit.x, this.memory.exit.y)
    this.memory.goto_room = this.memory.harvest
    this.setMode('transition')
    delete this.memory.exit
    delete this.memory.exit_dir
  }
}

Creep.prototype.doGoHome = function() {
  if(!this.memory.exit) {
    var exitDir = this.room.findExitTo(this.memory.home);
    var exit = this.pos.findClosestByRange(exitDir);
    this.memory.exit = exit
    this.memory.exit_dir = exitDir
  }
  if(this.memory.exit && this.moveCloseTo(this.memory.exit.x, this.memory.exit.y, 1)) {
    this.moveTo(this.memory.exit.x, this.memory.exit.y)
    this.memory.goto_room = this.memory.home
    this.setMode('transition')
    delete this.memory.exit
    delete this.memory.exit_dir
  }
}
