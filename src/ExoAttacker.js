/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-29 12:24:44
*/

'use strict';


Creep.prototype.setupExoAttackerMemory = function() {
  this.chooseExoTarget('attack')
}
Creep.prototype.assignTravelExoAttackerTasks = function() {
  if (this.mode() !== 'move-out' && this.mode() !== 'transition') {
    var flag = this.room.find(FIND_FLAGS)[0]
    if(flag) {
      if(Game.rooms[this.memory.exo_target] && this.hits >= this.hitsMax) {
        if (_.size(Game.rooms[this.memory.exo_target].find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER, energy: 0}}))) {
          this.setMode('move-out')
        } else if (_.size(Game.rooms[this.memory.exo_target].find(FIND_MY_CREEPS)) >= 4) {
          this.setMode('move-out')
        } else {
          this.setMode('rally')
        }
      if(_.size(flag.pos.findInRange(FIND_MY_CREEPS, 5)) >= 15) {
        this.setMode('move-out')
      }
    } else {
      this.setMode('rally')
    }
  } else {
    this.setMode('move-out')
  }
}
}

Creep.prototype.assignHomeExoAttackerTasks = function() {
  var flag = this.room.find(FIND_FLAGS)[0]
  if(flag && _.size(flag.pos.findInRange(FIND_MY_CREEPS, 5)) >= 6) {
    this.setMode('move-out')
  } else if(this.mode() !== 'move-out' && this.mode() != 'transition') {
    this.setMode('rally')
  }
}

Creep.prototype.assignRemoteExoAttackerTasks = function() {
  if(this.mode() !== 'transition') {
    if (this.mode() != 'go-home') {
      this.setMode('attack')
    }
    if (this.hits <= 500) {
      this.setMode('go-home')
    }
  }
}

Creep.prototype.doRally = function() {
  var flag = this.room.find(FIND_FLAGS)[0]
  if(!flag) {
    this.setMode('idle')
  } else {
    this.moveCloseTo(flag.pos.x, flag.pos.y, 2)
  }
}

Creep.prototype.doMoveOut = function() {
  this.gotoRoom(this.memory.exo_target)
}

Creep.prototype.doAttack = function() {
  if (Memory.tactic === 'rampart') {
    var target = Targeting.nearestHostalRampart(this.pos)
    if(target) {
      if(this.attack(target) === ERR_NOT_IN_RANGE) {
          this.rangedMassAttack()
          this.moveTo(target);
      }
    } else {
      Memory.tactic = 'default'
    }
  } else if (Memory.tactic === 'spread') {
    var target = Targeting.nearestHostalSpread(this.pos)
    if(this.attack(target) == ERR_NOT_IN_RANGE) {
        this.rangedMassAttack()
        this.moveTo(target);
    }
  } else {
    var target = Targeting.nearestHostalAnything(this.pos)
    if(target) {
      if(this.attack(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
        var blocker = Targeting.nearByStructures(this.pos)
        if (blocker) {
          console.log('Attacking blocker')
          this.attack(blocker)
        } else {
          this.rangedMassAttack()
        }
      } else if(this.attack(target) == ERR_NO_BODYPART) {
        this.moveCloseTo(25, 25, 5)
      }
    } else {
      this.suicide()
      //delete Memory.attack
    }
  }
}

Creep.prototype.doEnter = function() {
  this.gotoRoom(this.memory.attack)
}
