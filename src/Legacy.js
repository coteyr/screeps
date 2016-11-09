/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-09-28 19:47:54
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-08 06:49:58
*/

'use strict';

Creep.prototype.doBuild = function() {
  if(this.needsTarget()) this.setTarget(Targeting.findClosestConstruction(this.pos))
  if(this.hasTarget()) {
    var target = this.target()
    this.getCloseAndAction(target, this.build(target), 3)
  } else {
    this.setMode('repair');
  }
  if(this.isEmpty()) this.setMode('idle');
}

Creep.prototype.doRepair = function() {
  var creep = this
  if (this.needsTarget()) this.setTarget(Targeting.findClosestRepairTarget(this.pos, this.room))
  if(this.hasTarget()) {
    var target = this.target()
    this.getCloseAndAction(target, this.repair(target))
    if(target.hits >= target.hitsMax) this.clearTarget()
  } else {
    if(this.room.controller.my) {
      this.setMode('upgrade')
    } else {
      this.setMode('idle')
    }
  }
  if(this.isEmpty()) this.setMode('idle');
}

Creep.prototype.doWaitEnergy = function() {
  if(this.isFull()) {
    this.setMode('idle')
  }
}

Creep.prototype.doTransfer = function() {
  var me = this;
  if(this.needsTarget()) this.setTarget(Targeting.getTransferTarget(this.pos, this.room))
  if (this.hasTarget()) {
    this.doFillCloseExtensions() // return true
    var target = this.target()
    if(this.getCloseAndAction(target, this.dumpResources(target), 1)) {
      this.clearTarget()
    }
    if(target.isFull && target.isFull()) this.clearTarget()

  } else {
    var spawn = Finder.findSpawn(this.room.name)
    if(spawn && this.moveCloseTo(spawn.pos.x, spawn.pos.y, 1)) {
      this.drop(RESOURCE_ENERGY)
      this.setMode('idle')
    }
  }
  if(this.isEmpty()) {
    this.setMode('idle')
    this.clearTarget()
  }
}

Creep.prototype.pickupDropped = function() {
  if(!this.memory.dropped) {
    this.memory.dropped = Targeting.findClosestDroppedEnergy(this.pos, this.room.name)
  }
  if(this.memory.dropped) {
    var dropped = Game.getObjectById(this.memory.dropped.id)
    if(dropped) {
      this.getCloseAndAction(dropped, this.pickup(dropped), 1)
    } else {
      delete this.memory.dropped
    }
  } else {
    delete this.memory.dropped
  }
  if(this.hasSome()) this.setMode('idle')
  return this.memory.dropped
}

Creep.prototype.doPickup = function() {
  if(this.pickupDropped() && this.memory.dropped != null) return true;
  if(this.needsTarget()) this.setTarget(Targeting.findEnergySource(this.pos, this.room, this.memory.role))
  if(this.hasTarget()) {
    var target = this.target()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) {
      if(target.transfer) target.transfer(this, RESOURCE_ENERGY)
      if(target.withdraw) this.withdraw(target, RESOURCE_ENERGY)
      this.clearTarget()
    }
    if(target.isEmpty()) this.clearTarget()
  }
  if(this.isFull()) this.setMode('idle')
}

Creep.prototype.doFillCloseExtensions = function() {
  var target = Targeting.findCloseExtension(this.pos)
  if(target && target.hasRoom()) {
    this.dumpResources(target)
    if(this.isEmpty()) this.setMode('idle')
    return true
  }
}

Creep.prototype.doDemo = function() {
  if(this.needsTarget()) this.setTarget(this.room.memory.demos[0])
  if(this.hasTarget()) {
    var target = this.target()
    this.getCloseAndAction(target, this.dismantle(target), 1)
  } else {
    this.room.removeDemo(this.room.memory.demos[0])
    this.clearTarget()
    this.setMode('idle')
  }
  if(this.isFull()) this.setMode('upgrade')
}

Creep.prototype.doExcavate = function() {
  if(this.needsTarget()) this.setTarget(Finder.findMineral(this.room.name))
  if(this.hasTarget()){
    var target = this.target()
    this.getCloseAndAction(target, this.harvest(target), 1)
  }
  if(this.isFull()) this.setMode('stash')
}

Creep.prototype.doStash = function() {
  var container = Targeting.findClosestContainer(this.pos, this.room)
  if(container) this.dumpResources(container)
  this.setMode('idle')
}

Creep.prototype.doSend = function() {
  var containers = this.pos.findInRange(FIND_STRUCTURES, 3, {filter: function(c) { return c.structureType === STRUCTURE_CONTAINER && c.hasRoom() }}) // {structureType: STRUCTURE_CONTAINER}}) // function(c) {
  //  c.storedEnergy() < c.possibleEnergy() - this.carry.energy && c.structureType === STRUCTURE_CONTAINER && c.isActive()
  //});
  if (_.size(containers) > 0) {
    this.getCloseAndAction(containers[0], this.transfer(containers[0], RESOURCE_ENERGY), 1) // this.setMode('idle'
  } else {
    this.dumpResources()
  }
  if(this.carry.energy == 0) this.setMode('idle')
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
Creep.prototype.doEnter = function() {
  this.gotoRoom(this.memory.attack)
}
Creep.prototype.doPlop = function() {
  this.drop(RESOURCE_ENERGY)
  this.setMode('mine')
}
