/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-29 09:37:41
*/

'use strict';


let UpgraderCreep = function() {}
_.merge(UpgraderCreep.prototype, EnergyHaulingCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype, LocalCreep.prototype);


UpgraderCreep.prototype.tickCreep = function() {
  this.localState()
  this.energyState()
  this.checkState()
  this.recycleState()
}

UpgraderCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('check-dropped')
  if(this.stateIs('mine'))    Actions.mine(this, this.target(), 'choose', 'choose')
  if(this.stateIs('choose'))  Actions.targetWithState(this, this.room.controller, 'a-travel', 'old')
  if(this.stateIs('a-travel'))  Actions.moveToTarget(this, this.target(), 'upgrade', 3)
  if(this.stateIs('upgrade')) Actions.upgrade(this, 'check-dropped')
    /*
  if(!this.state()) this.setState('pick')
  if(this.stateIs('pick')) {
    this.clearTarget()
    this.setTarget(Targeting.findEnergySource(this.pos, this.room, this.memory.role))
    if(this.hasTarget()) this.setState('goto')
  }
  if(this.stateIs('goto')) {
    var target = this.target()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1) === true) this.setState('grab')
  }
  if(this.stateIs('grab')) {
    var target = this.target()
    if(target.transfer) target.transfer(this, RESOURCE_ENERGY)
    if(target.withdraw) this.withdraw(target, RESOURCE_ENERGY)
    if(this.hasSome()) this.setState('travel')
  }
  if(this.stateIs('travel')) {
    if(this.moveCloseTo(this.room.controller.pos.x, this.room.controller.pos.y, 3) === true) this.setState('upgrade')
  }
  if(this.stateIs('upgrade')) {
    this.upgradeController(this.room.controller)
    if(this.isEmpty()) this.setState('pick')
  } */
}
Creep.prototype.assignUpgraderTasks = function() {
  if(this.modeIs('idle')) {
    if(this.carry.energy < this.carryCapacity && this.room.carrierReady()) {
      this.setMode('skim')
    } else if(this.carry.energy < this.carryCapacity) {
      this.setMode('wait-energy')
    } else if(this.carry.energy >= this.carryCapacity) {
      this.setMode('upgrade')
    }
  }
}

Creep.prototype.doUpgrade = function() {
  if(this.carry.energy >= 1) {
    if(this.moveCloseTo(this.room.controller.pos.x, this.room.controller.pos.y, 3)) {
      this.upgradeController(this.room.controller)
    }
  } else {
    this.setMode('idle')
  }
}

Creep.prototype.doSkim = function() {
  var buffer = Finder.findStorage(this.room.name)
  if(!buffer) buffer = Finder.findExclusiveDropedEnergy(this.room.name)
  if(!buffer) buffer = Targeting.findEnergySource(this.pos, this.room, this.memory.role)
  if(buffer && this.moveCloseTo(buffer.pos.x, buffer.pos.y, 1)) {
    this.withdraw(buffer, RESOURCE_ENERGY)
    this.pickup(buffer)
  }
  if(this.carry.energy >= this.carryCapacity) {
    this.setMode('idle')
  }
}


