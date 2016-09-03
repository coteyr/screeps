/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-31 17:55:51
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
  if(!this.state()) this.setState('select')
  if(this.stateIs('select')) {
    this.clearTarget()
    this.setTarget(Targeting.findEnergySource(this.pos, this.room, this.memory.role))
    if(this.hasTarget()) this.setState('travel')
  }
  if(this.stateIs('travel')) {
    var target = this.target()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) this.setState('fill')
  }
  if(this.stateIs('fill')) {
    if(target.transfer) target.transfer(this, RESOURCE_ENERGY)
    if(target.withdraw) this.withdraw(target, RESOURCE_ENERGY)
    if(this.hasSome()) this.setState('choose')
    if(this.isEmpty()) this.setState('select')
  }
  if(this.stateIs('choose')){
    this.clearTarget()
    this.setTarget(Targeting.findClosestConstruction(this.pos))
    if(this.hasTarget()) this.setState('position')
    if(this.needsTarget()) this.setState('pick')
  }
  if(this.stateIs('position')) {
    var target = this.target()
    if(target) {
      if(this.moveCloseTo(target.pos.x, target.pos.y, 3)) this.setState('build')
    } else {
      this.setState('select')
    }
  }
  if(this.stateIs('build')) {
    var target = this.target()
    if(target) {
      this.build(target)
      if(this.isEmpty()) this.setState('select')
    } else {
      this.setState('select')
    }
  }
  if(this.stateIs('pick')) {
    this.clearTarget()
    this.setTarget(Targeting.findClosestRepairTarget(this.pos, this.room))
    if(this.hasTarget()) this.setState('travel')
  }
  if(this.stateIs('travel')) {
    var target = this.target()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 3)) this.setState('repair')
  }
  if(this.stateIs('repair')) {
    var target = this.target()
    this.repair(target)
    if(this.isEmpty()) this.setState('select')
    if(target.hits >= target.hitsMax) this.setState('select')
  }

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


