/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-11 10:24:08
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
  if(this.room.name === this.memory.home && this.carry.energy > 0 && this.memory.mode !== 'transition') {
    this.setMode('transfer')
  }
  if(this.room.name === this.memory.home && this.memory.mode === 'mine') {
    this.setMode('idle')
  }
}

Creep.prototype.assignHomeExoHarvesterTasks = function() {
  if(this.memory.mode !== 'transition') {
    if(this.carry.energy <= 0) {
      this.setMode('leave');
    } else {
      this.setMode('transfer');
    }
  }
}

Creep.prototype.assignRemoteExoHarvesterTasks = function() {
  if(this.memory.mode === 'transition') {
    // this.setMode('mine')
  } else {
    if (this.carry.energy < this.carryCapacity) {
      this.setMode('mine')
    } else if (this.carry.energy >= this.carryCapacity) {
      this.setMode('go-home')
    }
  }
}

Creep.prototype.gotoRoom = function(roomName) {
  if(!this.memory.exit) {
    var exitDir = this.room.findExitTo(roomName);
    var exit = this.pos.findClosestByRange(exitDir);
    this.memory.exit = exit
    this.memory.exit_dir = exitDir
  }
  if(this.memory.exit && this.moveCloseTo(this.memory.exit.x, this.memory.exit.y, 1)) {
    this.moveTo(this.memory.exit.x, this.memory.exit.y)
    this.memory.goto_room = roomName
    this.setMode('transition')
    delete this.memory.exit
    // delete this.memory.exit_dir
  }
}
Creep.prototype.doLeave = function() {
  this.gotoRoom(this.memory.harvest)
}

Creep.prototype.doGoHome = function() {
  this.gotoRoom(this.memory.home)
}
