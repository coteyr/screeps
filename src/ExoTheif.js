/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-15 01:19:24
*/

'use strict';

Creep.prototype.assignExoTheifTasks = function() {
    this.setupExoTheifMemory()
    if(this.room.name === this.memory.steal) {
      // I am in the remote room
      this.assignRemoteExoTheifTasks()
    } else if (this.room.name === this.memory.home) {
      this.assignHomeExoTheifTasks()
      // I am home
    } else {
      // I have no clue where I am

    }
}
Creep.prototype.setupExoTheifMemory = function() {
  this.chooseExoTarget('steal')
}

Creep.prototype.assignHomeExoTheifTasks = function() {
  if (this.carry.energy <= 0) {
    this.setMode('sneak-out')
  } else {
    this.setMode('transfer')
  }
}

Creep.prototype.assignRemoteExoTheifTasks = function() {
  if(this.memory.mode === 'transition') {
    // this.setMode('mine')
  } else {
    if (this.carry.energy < this.carryCapacity) {
      this.setMode('steal')
    } else if (this.carry.energy >= this.carryCapacity) {
      this.setMode('go-home')
    }
  }
}


Creep.prototype.doSteal = function() {
  if(!this.memory.target) {
    var target = Targeting.nearestStructure(this.pos)
    this.memory.target = target
  } else {
    var target = Game.getObjectById(this.memory.target.id)
  }
  if(target) {
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) {
      this.dismantle(target)
    }
  } else {
    delete this.memory.target
  }
  if(this.carry.energy >= this.carryCapacity) {
    this.setMode('go-home');
  }
}

Creep.prototype.doSneakOut = function() {
  this.gotoRoom(this.memory.steal)
}

