/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 02:56:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-20 18:25:50
*/

'use strict';

// Target -> Position -> [Mine -> Dump -> Mine] -> Recycle

let MinerCreep = function(){}
_.merge(MinerCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype);

MinerCreep.prototype.tickCreep = function() {
  this.checkState()
  this.recycleState()
}

MinerCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('target')
  if(this.stateIs('target')) Actions.targetWithState(this, Finder.findSourcePosition(this.room.name, this.memory.role), 'position')
  if(this.stateIs('position')) Actions.moveToTarget(this, this.target(), 'mine')
  if(this.stateIs('mine')) Actions.mine(this, this.target(), 'dump')
  if(this.stateIs('dump')) Actions.dump(this, Targeting.findCloseContainer(this.pos, 1), 'mine')
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
