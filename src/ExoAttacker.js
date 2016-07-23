/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-19 23:32:49
*/

'use strict';


Creep.prototype.setupExoAttackerMemory = function() {
  this.chooseExoTarget('attack')
}
Creep.prototype.assignTravelExoAttackerTasks = function() {
  this.setMode('move-out')
}

Creep.prototype.assignHomeExoAttackerTasks = function() {
  if (_.filter(Game.creeps, (creep) => creep.memory.role == 'exo-attacker').length < 6 && this.memory.mode != 'move-out') {
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
  this.gotoRoom(this.memory.exo_target)
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
