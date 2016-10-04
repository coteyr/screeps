/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-04 06:03:15
*/

'use strict';

let ExoCarrier = function() {}
_.merge(ExoCarrier.prototype, StateMachine.prototype, RecyclableCreep.prototype, RemoteCreep.prototype)

ExoCarrier.prototype.tickCreep = function() {
  this.remoteState()
  this.checkState()
  this.recycleState()
}

ExoCarrier.prototype.checkState = function() {
  if(!this.state()) this.setState('r-move-out')
  if(this.stateIs('select')) Actions.targetWithState(this, Targeting.findClosestDroppedEnergy(this.pos, this.room.name), 'goto', 'choose')
  if(this.stateIs('goto')) Actions.moveToTarget(this, this.target(), 'pickup', 1, 'select')
  if(this.stateIs('pickup')) Actions.pickup(this, this.target(), 'go-home')
  if(this.stateIs('choose')) Actions.targetWithState(this, Targeting.findEnergySource(this.pos, this.room, this.memory.role), 'position', 'select')
  if(this.stateIs('position')) Actions.moveToTarget(this, this.target(), 'fill')
  if(this.stateIs('fill')) Actions.grab(this, this.target(), 'go-home', 'select')
  if(this.stateIs('are-home')) Actions.targetWithState(this, Targeting.getTransferTarget(this.pos, this.room), 'travel')
  if(this.stateIs('travel')) Actions.moveToTarget(this, this.target(), 'dump', 1, 'are-home')
  if(this.stateIs('dump')) Actions.dump(this, this.target(), 'r-move-out', 'are-home')
  if(this.stateIs('travel') && this.isEmpty()) this.setState('r-move-out')
}


/*Creep.prototype.setupExoCarrierMemory = function() {
  this.chooseExoTarget('carry')
}

Creep.prototype.assignTravelExoCarrierTasks = function() {
  if(this.hasSome() && this.mode() !== 'transition') {
    this.setMode('go-home')
  } else if (this.mode() !== 'transition') {
    this.setMode('leave')
  }
}

Creep.prototype.assignHomeExoCarrierTasks = function(){
  if(this.modeIs('idle')) {
    if(this.hasSome()) this.setMode('store')
    if(this.isEmpty()) this.setMode('leave')
  }
}


Creep.prototype.assignRemoteExoCarrierTasks = function() {
  if(this.mode() === 'transition' || this.mode() != 'idle') {
    // this.setMode('mine')
  } else {
    if (this.hasRoom()) {
      this.setMode('pickup')
    } else if (this.isFull()) {
      this.setMode('take-home')
    }
  }
}*/

Creep.prototype.doTakeHome = function() {
  var road = Targeting.findRoadUnderneath(this.pos)
  if(road && road.hits < road.hitsMax) this.repair(road)
  this.doGoHome()
  if(this.isEmpty()) {
    this.setMode('idle')
  }

}

Creep.prototype.doStore = function() {
  var container = this.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(c) { return c.structureType === STRUCTURE_CONTAINER}}) // {structureType: STRUCTURE_CONTAINER}}) // function(c) {
  if (container) {
    if(this.moveCloseTo(container.pos.x, container.pos.y, 1)) this.dumpResources(container)
  } else {
    this.setMode('transfer')
  }
  if(this.isEmpty()) this.setMode('idle')
  delete this.memory.exit_dir
  delete this.memory.exit
}

