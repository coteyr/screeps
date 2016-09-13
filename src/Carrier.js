/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 10:23:42
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-07 13:08:04
*/

'use strict';

// [check-dropped -> select -> position -> fill -> choose -> travel -> dump] -> recycle
//               |->        goto -> pickup      ->|

let CarrierCreep = function() {}
_.merge(CarrierCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype, LocalCreep.prototype);


CarrierCreep.prototype.tickCreep = function() {
  this.localState()
  this.checkState()
  this.recycleState()
}

CarrierCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('check-dropped')
  if(this.stateIs('check-dropped')) {
    this.clearTarget()
    this.setTarget(Finder.findExclusiveDropedEnergy(this.room.name))
    if(this.hasTarget()) {
      this.setState('goto')
    } else {
      this.setState('select')
    }
  }
  if(this.stateIs('goto')){
    var target = this.target()
    if(target) {
      if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) this.setState('pickup')
    } else {
      this.clearTarget()
      this.setState('check-dropped')
    }
  }
  if(this.stateIs('pickup')) {
    var target = this.target()
    this.pickup(target)
    this.setState('choose')
  }
  if(this.stateIs('select')) {
    this.clearTarget()
    this.setTarget(Targeting.findEnergySource(this.pos, this.room, this.memory.role))
    if(this.hasTarget()) this.setState('position')
  }
  if(this.stateIs('position')) {
    var target = this.target()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) this.setState('fill')
  }
  if(this.stateIs('fill')) {
    var target = this.target()
    if(target.transfer) target.transfer(this, RESOURCE_ENERGY)
    if(target.withdraw) this.withdraw(target, RESOURCE_ENERGY)
    if(this.hasSome()) this.setState('choose')
    if(this.isEmpty()) this.setState('check-dropped')
  }
  if(this.stateIs('choose')) {
    this.clearTarget()
    this.setTarget(Targeting.getTransferTarget(this.pos, this.room))
    if(this.hasTarget()) this.setState('travel')
  }
  if(this.stateIs('travel')) {
    var target = this.target()
    this.doFillCloseExtensions()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) this.setState('dump')
  }
  if(this.stateIs('dump')) {
    var target = this.target()
    this.dumpResources(target)
    this.clearTarget()
    if(this.hasSome()) this.setState('choose')
    if(this.isEmpty()) this.setState('check-dropped')
  }


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
