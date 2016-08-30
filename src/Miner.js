/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 02:56:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-30 18:34:27
*/

'use strict';

// Target -> Position -> [Mine -> Dump -> Mine] -> Recycle

let MinerCreep = function(){}
_.merge(MinerCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype);

MinerCreep.prototype.tickCreep = function() {
  console.log('Ticking Miner')
  this.checkState()
  this.recycleState()
}

MinerCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('target') // this.memory.state = 'target'
  if(this.stateIs('target')) { //this.memory.state === 'target') {
    this.setTarget(Finder.findSourcePosition(this.room.name, this.memory.role))
    if(this.hasTarget()) this.setState('position')
  }
  if(this.stateIs('position')) {
    var target = this.target()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) this.setState('mine')
  }
  if(this.stateIs('mine')) {
    var target = this.target()
    this.harvest(target)
    if(this.hasSome()) this.setState('dump')
  }
  if(this.stateIs('dump')) {
    var drop = Targeting.findCloseContainer(this.pos, 1)
    this.dumpResources(drop)
    this.setState('mine')
  }
}

Creep.prototype.doSend = function() {
  var containers = this.pos.findInRange(FIND_STRUCTURES, 3, {filter: function(c) { return c.structureType === STRUCTURE_CONTAINER && c.hasRoom() }}) // {structureType: STRUCTURE_CONTAINER}}) // function(c) {
  //  c.storedEnergy() < c.possibleEnergy() - this.carry.energy && c.structureType === STRUCTURE_CONTAINER && c.isActive()
  //});
  console.log(this.name + " " + _.size(containers))
  if (_.size(containers) > 0) {
    this.getCloseAndAction(containers[0], this.transfer(containers[0], RESOURCE_ENERGY), 1) // this.setMode('idle'
  } else {
    this.dumpResources()
  }
  if(this.carry.energy == 0) this.setMode('idle')
}
