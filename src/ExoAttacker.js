/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-12 19:06:29
*/

'use strict';

Creep.prototype.assignExoAttackerTasks = function() {
  if(!this.memory.mode) {
    this.setMode('idle')
  }
  if(!this.memory.attack) {
    this.memory.attack = this.room.memory.attack
  }
    if(this.room.name === this.memory.attack) {
      // I am in the remote room
      this.assignRemoteExoAttackerTasks()
    } else if (this.room.name === this.memory.home) {
      this.assignHomeExoAttackerTasks()
      // I am home
    } else {
      // I have no clue where I am

    }
}

Creep.prototype.assignHomeExoAttackerTasks = function() {
  if (_.filter(Game.creeps, (creep) => creep.memory.role == 'exo-attacker').length < 1 && this.memory.mode != 'move-out') {
    this.setMode('rally')
  } else {
    this.setMode('move-out')
  }
}

Creep.prototype.assignRemoteExoAttackerTasks = function() {
  if (this.memory.mode != 'enter') {
    this.setMode('attack')
  }
}

Creep.prototype.doRally = function() {
  var flag = this.room.find(FIND_FLAGS)[0]
  this.moveCloseTo(flag.pos.x, flag.pos.y, 5)
}

Creep.prototype.doMoveOut = function() {
  this.gotoRoom(this.memory.attack)
}

Creep.prototype.doAttack = function() {
  var target = Targeting.nearestHostalAnything(this.pos)
  if(target) {
    if(this.attack(target) == ERR_NOT_IN_RANGE) {
      this.moveTo(target);
      var blocker = Targeting.nearByStructures(this.pos)
      if (blocker) {
        this.attack(blocker)
      } else {
        this.rangedMassAttack()
      }
    } else if(this.attack(target) == ERR_NO_BODYPART) {
      this.moveCloseTo(25, 25, 5)
    }
  } else {
    this.suicide()
    delete Memory.attack
  }
}

Creep.prototype.doEnter = function() {
  this.gotoRoom(this.memory.attack)
}
