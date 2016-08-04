/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 10:23:42
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-04 00:12:21
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
    if(this.doFillCloseExtensions()) return true
    var target = this.target()
    if(this.getCloseAndAction(target, this.dumpResources(target), 1)) {
      target.resetCallForEnergy()
      this.clearTarget()
    }
    // this will override move
    if(target.isFull()) this.clearTarget()
  }
  if(this.isEmpty()) this.setMode('idle')
}

Creep.prototype.pickupDropped = function() {
  var dropped = Finder.findDropedEnergy(this.room.name)
  if(_.size(dropped) > 0) {
    this.getCloseAndAction(dropped[0], this.pickup(dropped[0]), 1)
    if(this.isFull()) this.setMode('idle')
    return true
  }
}

Creep.prototype.doPickup = function() {
  if(this.pickupDropped()) return true;
  if(this.needsTarget()) this.setTarget(Targeting.findEnergySource(this.pos, this.room, this.memory.role))
  if(this.hasTarget()) {
    var target = this.target()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) {
      target.transfer(this, RESOURCE_ENERGY)
      this.withdraw(target, RESOURCE_ENERGY)
    }
    if(target.isEmpty()) this.clearTarget()
  }
  if(this.isFull()) this.setMode('idle')
}

Creep.prototype.doFillCloseExtensions = function() {
  var target = Targeting.findCloseExtension(this.pos)
  if(target && target.hasRoom()) {
    target.resetCallForEnergy()
    this.dumpResources(target)
    return true
  }
}
