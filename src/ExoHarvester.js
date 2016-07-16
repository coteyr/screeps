/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-15 21:43:52
*/

'use strict';

Creep.prototype.setupExoHarvesterMemory = function() {
  this.chooseExoTarget('harvest')
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
