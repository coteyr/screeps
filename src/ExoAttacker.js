/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-09 11:38:41
*/

'use strict';

Creep.prototype.assignExoAttackerTasks = function() {
  if(!this.memory.mode) {
    this.setMode('idle')
  }
  if(!this.memory.home) {
    this.memory.home = this.room.name
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
  if (_.filter(Game.creeps, (creep) => creep.memory.role == 'exo-attacker').length < 5) {
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
  if(!this.memory.exit) {
    var exitDir = this.room.findExitTo(this.memory.attack);
    var exit = this.pos.findClosestByRange(exitDir);
    this.memory.exit = exit
  }
  if(this.memory.exit && this.moveCloseTo(this.memory.exit.x, this.memory.exit.y, 1)) {
    this.moveTo(this.memory.exit.x, this.memory.exit.y)
    this.setMode('enter')
    delete this.memory.exit
  }
}

Creep.prototype.doAttack = function() {
  var target = Targeting.nearestHostalAnything()
  if(target) {
    if(this.attack(target) == ERR_NOT_IN_RANGE) {
      this.moveTo(target);
      var blocker = Targeting.nearByStructures()
      if (blocker) {
        this.attack(blocker)
      } else {
        this.rangedMassAttack()
      }
    }
  } else {
    this.suicide()
    delete Memory.attack
  }
}
