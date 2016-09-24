/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-20 18:28:56
*/

'use strict';


// [select -> travel -> demo -> goto -> upgrade]

let DemoCreep = function() {}
_.merge(DemoCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype, LocalCreep.prototype);

DemoCreep.prototype.tickCreep = function() {
  this.localState()
  this.checkState()
  this.recycleState()
}
DemoCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('select')
  if(this.stateIs('select')) Actions.targetWithState(this, Targeting.findNearestDemo(this.pos, this.room), 'travel')
  if(this.stateIs('travel')) Actions.moveToTarget(this, this.target(), 'demo', 1, 'select')
  if(this.stateIs('demo')) Actions.demolish(this, this.target(), 'goto', true, 'select')
  if(this.stateIs('goto')) Actions.moveToTarget(this, this.room.controller, 'upgrade')
  if(this.stateIs('upgrade')) Actions.upgrade(this, 'select')
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


