/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-07-03 15:12:45
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-21 22:43:53
*/

'use strict';
Creep.prototype.originalWithdraw = Creep.prototype.withdraw
Creep.prototype.originalPickup = Creep.prototype.pickup
Creep.prototype.orignalTransfer = Creep.prototype.transfer
Creep.prototype.orignalHarvest = Creep.prototype.harvest
Creep.prototype.orignalUpGradeController = Creep.prototype.upgradeController
Creep.prototype.originalMoveTo = Creep.prototype.moveTo
Creep.prototype.originalMove = Creep.prototype.move
Creep.prototype.orignalBuild = Creep.prototype.build
Creep.prototype.originalAttack = Creep.prototype.attack
Creep.prototype.orignalClaimController = Creep.prototype.claimController

Creep.prototype.pickup = function(target) {
  let result = null
  if(target.structureType == STRUCTURE_CONTAINER || target.structureType == STRUCTURE_STORAGE) {
    result = this.work(this.originalWithdraw, target, Config.defaultRange, [RESOURCE_ENERGY])
  }
  if(target.resourceType == RESOURCE_ENERGY) {
    result  = this.work(this.originalPickup, target, Config.defaultRange)
  }
  if( result === OK ) this.clearTarget()
  return result
}
Creep.prototype.harvest = function(target) {
  if(!target) {
    if(this.hasTarget()) {
      target = this.target()
    } else {
      this.setTarget(Targeting.findOpenSourceSpot(this.room.name))
      target = this.target()
    }
  }
  let result = this.work(this.orignalHarvest, target, Config.defaultRange)
  return result
}
Creep.prototype.build = function(target) {
  if(!target) {
    if(this.needsTarget('build')) this.setTarget(_.first(Finder.findConstructionSites(this.room.name)), 'build')
    if(this.hasTarget('build')) target = this.target('build')
  }
  return this.work(this.orignalBuild, target, Config.defaultRange)
}
Creep.prototype.attack = function(target) {
  return this.work(this.originalAttack, target, 1, {preWalk: true})
}

Creep.prototype.upgradeController = function() {
  let result = this.work(this.orignalUpGradeController, this.room.controller, Config.upgradeRange)
  return result
}
Creep.prototype.transfer = function(target) {
  let result = this.work(this.orignalTransfer, target, Config.defaultRange, [RESOURCE_ENERGY])
  return result
}
Creep.prototype.work = function(method, target, range, options = []) {
  if(!target) return false
  let start = Game.cpu.getUsed();
  let value = null;
  if(this.memory.inRange || this.pos.inRangeTo(target.pos.x, target.pos.y, range)) {
    this.memory.inRange = true
    value = method.apply(this, _.flatten([target, options]))
    Storage.addStat('account-cpu-work', Game.cpu.getUsed() - start)
    if(value === ERR_NOT_IN_RANGE) delete this.memory.inRange
  } else {
    if(!options.preWalk) {
      value = this.goTo(target)
    }
    Storage.addStat('account-cpu-move', Game.cpu.getUsed() - start)
  }
  return value
}

Creep.prototype.moveTo = function(firstArg, secondArg, opts) {

  if(this.fatigue > 0) return ERR_TIRED
  if(this.room.name === "E3N24" && this.pos.x >= 17 && this.pos.x <= 24 && this.pos.y >= 33 && this.pos.y <= 39) {
    opts = { ignoreCreeps: true}
    // Log.info(firstArg)
    // Log.info(Finder.findCreepsInArea(this.room.name, 33, 19, 38, 23).length)
    if(Finder.findCreepsInArea(this.room.name, 33, 19, 38, 23).length > 0) {
      if(Storage.read("moveOne" + this.room.name, true)) {
        Storage.write("moveOne" + this.room.name, false)
      } else {
        this.memory.evac = true
      }

    }
  }
  if(this.pos.x === 25 && this.pos.y === 39) delete this.memory.evac
  if(this.memory.evac === true) {
    return this.originalMoveTo(new RoomPosition(25, 39, this.room.name), opts)
  }
  if(this.room.name === "W44S9" && this.pos.x >= 34 && this.pos.x <= 42 && this.pos.y >= 40 && this.pos.y <= 42) {
    opts = { ignoreCreeps: true, reusePath: 0}
  }

  let empty = Targeting.findCloseEmptyExtension(this.pos)
  if(empty) {
    this.transfer(empty, RESOURCE_ENERGY)
  }
  return this.originalMoveTo(firstArg, secondArg, opts)
}


Creep.prototype.move = function(direction) {
  let things = this.pos.look()
  _.each(things, t => {
    if(t.type === 'structure' && t.structure.structureType === STRUCTURE_ROAD) this.repair(t.structure)
    if(this.pos.x > this.room.memory.right || this.pos.x < this.room.memory.left || this.pos.y > this.room.memory.bottom || this.pos.y < this.room.memory.top) return false
    // if(Finder.findConstructionSites(this.room.name).length < Config.maxConstructionSites && (t.type === 'terrain' && t.terrain === 'plain' || t.type === 'terrain' && t.terrain === 'swamp')) this.room.createConstructionSite(this.pos, STRUCTURE_ROAD)
  })
  let start = Game.cpu.getUsed();
  this.originalMove(direction)
}

Creep.prototype.claimController = function() {
  let result = this.work(this.orignalClaimController, this.room.controller, Config.defaultRange)
  return result
}
Creep.prototype.gotoTargetRoom = function() {
  if(this.room.name === this.memory.targetRoom) {
    return true
  } else {
    let pos = new RoomPosition(25, 25, this.memory.targetRoom)
    this.moveTo(pos)
    return false
  }
}
