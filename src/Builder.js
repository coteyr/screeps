/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-12 20:45:21
*/

'use strict';

// [select -> travel -> fill -> choose -> position -> build]
//                                    |-> travel -> repair ]
let BuilderCreep = function() {}
_.merge(BuilderCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype);


BuilderCreep.prototype.tickCreep = function() {
  this.checkState()
  this.recycleState()
}

BuilderCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('check-dropped')
  if(this.stateIs('check-dropped')) Actions.targetWithState(this, Finder.findExclusiveDropedEnergy(this.room.name), 'goto', 'select')
  if(this.stateIs('goto')) Actions.moveToTarget(this, this.target(), 'pickup')
  if(this.stateIs('pickup')) Actions.pickup(this, this.target(), 'choose')
  if(this.stateIs('select')) {
    if(this.room.carrierReady()) {
      Actions.targetWithState(this, Targeting.findEnergySource(this.pos, this.room, this.memory.role), 'travel')
    } else {
      Actions.targetWithState(this, Finder.findHarvesterPosition(this.room.name, this.memory.role), 'travel')
    }
  }
  if(this.stateIs('travel')) Actions.moveToTarget(this, this.target(), 'fill')
  if(this.stateIs('fill')) Actions.mineOrGrab(this, this.target(), 'choose', true, 'select')
  if(this.stateIs('choose')) Actions.targetWithState(this, Targeting.findClosestConstruction(this.pos), 'position', 'pick')
  if(this.stateIs('position')) Actions.moveToTarget(this, this.target(), 'build')
  if(this.stateIs('build')) Actions.build(this, this.target(), 'select', 'select')
  if(this.stateIs('pick')) Actions.targetWithState(this, Targeting.findClosestRepairTarget(this.pos, this.room, this), 'travel', 'traverse')
  if(this.stateIs('travel')) Actions.moveToTarget(this, this.target(), 'repair', 3)
  if(this.stateIs('repair')) Actions.repair(this, this.target(), 'select', 'select')
  if(this.stateIs('traverse')) Actions.moveToTarget(this, this.room.controller, 'upgrade')
  if(this.stateIs('upgrade')) Actions.upgrade(this, 'select')
}

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


