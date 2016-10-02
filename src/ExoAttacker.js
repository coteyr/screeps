/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-28 19:56:21
*/

'use strict';

// let ExoAttacker = function() {}
// _.merge(ExoAttacker.prototype, StateMachine.prototype, RecyclableCreep.prototype, RemoteCreep.prototype)

Creep.prototype.setupExoAttackerMemory = function() {
  this.chooseExoTarget('attack')
}
Creep.prototype.assignTravelExoAttackerTasks = function() {
  if (this.mode() !== 'move-out' && this.mode() !== 'transition') {
   this.setMode('rally')
    var flag = Finder.findFlags(this.room.name)[0]
    if(flag) {
      if(Game.rooms[this.memory.exo_target] && this.hits >= this.hitsMax) {
        if (_.size(Finder.findAllCreeps(this.memory.exo_target)) >= ARMY[this.room.tactic()].rally) this.setMode('move-out')
      }
      if(_.size(Targeting.findMyCloseCreeps(flag.pos, 5)) >= ARMY[this.room.tactic()].rally) this.setMode('move-out')
    } else {
      this.setMode('move-out')
    }
  }
}

Creep.prototype.assignHomeExoAttackerTasks = function() {
  var flag = this.room.find(FIND_FLAGS)[0]
  if(flag && _.size(flag.pos.findInRange(FIND_MY_CREEPS, 5)) >= ARMY[this.room.tactic()].rally) {
    this.setMode('move-out')
  } else if(!flag) {
    this.setMode('move-out')
  } else if(this.mode() !== 'move-out' && this.mode() != 'transition') {
    this.setMode('rally')
  }
  //this.setMode('idle')
}

Creep.prototype.assignRemoteExoAttackerTasks = function() {
  if(this.mode() !== 'transition') {
    if (this.mode() != 'go-home') {
      this.setMode('attack')
    }
    if (this.hits <= 1) {
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
  this.heal(this)
  var go = true
  /*Finder.findSquad(this.room.name).forEach( function(creep) {
    if(creep.fatigue !== 0) go = false
  })*/
  if(go) this.gotoRoom(this.memory.exo_target)
}

Creep.prototype.doAttack = function() {
  if(Game.rooms[this.memory.home].tactic() === 'swarm') this.normalAttack()
  if(Game.rooms[this.memory.home].tactic() === 'heavy') this.versitleAttack()
  if(Game.rooms[this.memory.home].tactic() === 'kite') this.kiteAttack()
  if(Game.rooms[this.memory.home].tactic() === 'litewalls') this.kiteAttack()
  if(Game.rooms[this.memory.home].tactic() === 'noob-tower') this.breakWalls()
  if(Game.rooms[this.memory.home].tactic() === 'drain') this.drainTower()
  if(Game.rooms[this.memory.home].tactic() === 'block') this.block()
  if(Game.rooms[this.memory.home].tactic() === 'post') this.post()
  //this.normalAttack()
}
Creep.prototype.post = function() {
    var flag = this.room.find(FIND_FLAGS)[0]
    if(flag) {
      this.moveCloseTo(flag.pos.x, flag.pos.y, 3)
    } else {
      this.moveCloseTo(25, 25, 10)
    }
  if(this.room.hasHostiles(this.room.name)) this.versitleAttack()
}

Creep.prototype.versitleAttack = function() {
  if(this.hits < this.hitsMax) this.heal(this)
  if(this.needsTarget()) this.setTarget(Targeting.nearestHostalCreep(this.pos))
  let target = this.target()
  if(target.pos.x > 48 || target.pos.y > 48 || target.pos.x < 2 || target.pos.y < 2) return true
  if(target) {
    if(BodyBuilder.getCount(target.body, ATTACK) > 5){
      this.kiteAttack()
    } else {
      this.normalAttack()
    }
  } else {
    this.normalAttack()
  }
}
Creep.prototype.breakWalls = function() {
  if(this.needsTarget()) this.setTarget(Targeting.nearestNonController(this.pos))
  let target = this.target()
  if(this.hasTarget()) {
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1) === true) {
      this.attack(target)
    }
  }
}
Creep.prototype.block = function() {
  if(this.needsTarget()) this.setTarget(Targeting.nearestHostalSpawn(this.pos))
  let target = this.target()
  if(this.hasTarget()) {
    this.moveCloseTo(target.pos.x, target.pos.y, 2)
  }
}
Creep.prototype.drainTower = function() {
  var target = Targeting.findMostNeedingHeals(this.pos, this.room)
  if(this.heal(target) == ERR_NOT_IN_RANGE) {
    this.moveTo(target);
  } else {
    this.move(BOTTOM_RIGHT)
  }
}
Creep.prototype.kiteAttack = function() {
  var target = Targeting.nearestHostalCreep(this.pos)
  if(target) {
    var range = this.pos.getRangeTo(target)
    if(this.hits < (this.hitsMax * 0.75)) range = range - 5  // run away for healing

    if(range > 2) {
      this.moveTo(target)
      this.heal(this)
      this.rangedMassAttack()
    } else if(range === 2) {
      this.heal(this)
      this.rangedMassAttack()
    } else if(range <= 1) {
      //if (this.pos.x > 10 && this.pos.y > 10 && this.pos.x < 40 && this.pos.y < 40) {
        var dir = this.pos.getDirectionTo(target)
        var go = dir + 4
        if (go > 8) go = go - 8
        this.move(go)
        this.rangedAttack(target)
     // } else {
     //   this.moveCloseTo(25, 25, 5)
     // }
      this.heal(this)
    }
  } else {
    // this.normalAttack()
  }
}

Creep.prototype.normalAttack = function() {
 this.rangedMassAttack()
 if(this.hits < this.hitsMax && this.room.hasHostiles() <= 0) this.heal(this)
 if(this.needsTarget()) {
    this.setTarget(Targeting.nearestHostalAnything(this.pos))
    this.heal(this)
  }
  var target = this.target()
  if(target) {
    if(this.attack(target) == ERR_NOT_IN_RANGE) {
      if(this.moveTo(target) == -2) {
        var blocker = Targeting.nearByStructures(this.pos)
        if (blocker) {
          this.setTarget(blocker)
          this.rangedMassAttack()
          this.attack(blocker)
        }
      } else {
        this.rangedMassAttack()
      }
    } else if(this.attack(target) == ERR_NO_BODYPART) {
      this.moveCloseTo(25, 25, 5)
    }
  } else {
    this.heal(this)
    //this.setMode('go-home')
    //delete Memory.attack
  }
}

Creep.prototype.doEnter = function() {
  this.gotoRoom(this.memory.attack)
}
