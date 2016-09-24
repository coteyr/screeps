/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 02:56:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-21 05:14:50
*/

'use strict';

let ExcavatorCreep = function() {}
_.merge(ExcavatorCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype, LocalCreep.prototype);


ExcavatorCreep.prototype.tickCreep = function() {
  this.localState()
  this.checkState()
  this.recycleState()
}

ExcavatorCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('find')
  if(this.stateIs('find')) Actions.targetWithState(this, Finder.findMineral(this.room.name), 'travel')
  if(this.stateIs('travel')) Actions.moveToTarget(this, this.target(), 'excavate', 1, 'find')
  if(this.stateIs('excavate')) Actions.excavate(this, this.target(), 'dump')
  if(this.stateIs('dump')) Actions.targetWithState(this, Targeting.findClosestContainer(this.pos, this.room), 'move', 'find')
  if(this.stateIs('move')) Actions.moveToTarget(this, this.target(), 'stash', 1, 'stash')
  if(this.stateIs('stash')) Actions.dump(this, this.target(), 'find', 'find')
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
