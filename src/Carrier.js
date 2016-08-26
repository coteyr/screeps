/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 10:23:42
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-25 07:05:45
*/

'use strict';

Creep.prototype.assignCarrierTasks = function() {
  if(this.modeIs('idle')) {
    if(this.hasRoom()) this.setMode('pickup')
    if(this.isFull()) this.setMode('transfer')
  }
}
Creep.prototype.doWaitEnergy = function() {
  if(this.hasRoom()) this.callForEnergy()
  if(this.isFull()) {
    this.resetCallForEnergy()
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
      if (target.resetCallForEnergy) target.resetCallForEnergy()
      this.clearTarget()
    }
    if(target.isFull && target.isFull()) this.clearTarget()

  } else {
    var spawn = Finder.findSpawn(this.room.name)
    if(spawn && this.moveCloseTo(spawn.pos.x, spawn.pos.y, 1)) this.setMode('idle')
  }
  if(this.isEmpty()) {
    this.setMode('idle')
    this.clearTarget()
  }
}

Creep.prototype.pickupDropped = function() {
  var dropped = Finder.findDropedEnergy(this.room.name)
  if(_.size(dropped) > 0) {
    this.getCloseAndAction(dropped[0], this.pickup(dropped[0]), 1)
    if(this.isFull()) this.setMode('idle')
    return true
  }
  return false
}

Creep.prototype.doPickup = function() {
  if(this.pickupDropped()) return true;
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
    if(target.resetCallForEnergy) target.resetCallForEnergy()
    this.dumpResources(target)
    if(this.isEmpty()) this.setMode('idle')
    return true
  }
}
