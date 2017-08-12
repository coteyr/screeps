/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-07-03 15:12:45
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-08 19:46:49
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
  let result = this.work(this.orignalHarvest, target, Config.defaultRange)
  return result
}
Creep.prototype.build = function(target) {
  return this.work(this.orignalBuild, target, Config.defaultRange)
}
Creep.prototype.attack = function(target) {
  return this.work(this.originalAttack, target, 1)
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
  let start = Game.cpu.getUsed();
  let value = null;
  if(this.memory.inRange || this.pos.inRangeTo(target.pos.x, target.pos.y, range)) {
    this.memory.inRange = true
    value = method.apply(this, _.flatten([target, options]))
    Storage.addStat('account-cpu-work', Game.cpu.getUsed() - start)
    if(value === ERR_NOT_IN_RANGE) delete this.memory.inRange
  } else {
    value = this.goTo(target)
    Storage.addStat('account-cpu-move', Game.cpu.getUsed() - start)
  }
  return value
}

Creep.prototype.moveTo = function(firstArg, secondArg, opts) {
  if(this.fatigue > 0) return ERR_TIRED
  if(this.room.name === "E3N24" && this.pos.x >= 17 && this.pos.x <= 24 && this.pos.y >= 33 && this.pos.y <= 39) {
    opts = { ignoreCreeps: true}
    Log.info(firstArg)
    Log.info(Finder.findCreepsInArea(this.room.name, 33, 19, 38, 23).length)
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
Creep.prototype.orignalClaimController = Creep.prototype.claimController
Creep.prototype.claimController = function() {
  let result = this.work(this.orignalClaimController, this.room.controller, Config.defaultRange)
  return result
}
