/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-04 12:02:05
*/

'use strict';
// [pick -> travel -> harvest -> choose -> select |-> position -> build]
//                                                |-> travel -> repair ]
//                                                |-> traverse -> upgrade controller
//                                                |-> select -> move -> store
//                                                |-> goto -> fill
let HarvesterCreep = function() {}
_.merge(HarvesterCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype);


HarvesterCreep.prototype.tickCreep = function() {
  this.checkState()
  this.recycleState()
}

HarvesterCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('target')
  if(this.stateIs('target')) Actions.targetWithState(this, Finder.findSourcePosition(this.room.name, this.memory.role), 'position')
  if(this.stateIs('position')) Actions.moveToTarget(this, this.target(), 'mine')
  if(this.stateIs('mine')) Actions.mine(this, this.target(), 'choose', 'choose')
  if(this.room.controller.level < 3) {
    if(this.stateIs('choose')) Actions.targetWithState(this, this.room.controller, 'travel')
    if(this.stateIs('travel')) Actions.moveToTarget(this, this.target(), 'dump', 1, 'target')
    if(this.stateIs('dump')) Actions.upgrade(this, 'target')
  } else {
    if(this.stateIs('choose')) Actions.targetWithState(this, Targeting.getTransferTarget(this.pos, this.room), 'travel')
    if(this.stateIs('travel')) Actions.moveToTarget(this, this.target(), 'dump', 1, 'target')
    if(this.stateIs('dump')) Actions.dump(this, this.target(), 'target', 'choose')
  }
  // add in build and repair
}

Creep.prototype.assignHarvesterTasks = function() {
  if(this.hasRoom()) this.setMode('mine')
  if(_.size(this.room.find(FIND_CONSTRUCTION_SITES)) >= 5 && !this.isEmpty() && this.room.isFull()) this.setMode('build')
  if(_.size(this.room.find(FIND_CONSTRUCTION_SITES)) < 5 && !this.isEmpty() && this.room.isFull()) this.setMode('upgrade');
  if(!this.isEmpty() && this.room.hasRoom()) this.setMode('transfer');
}

Creep.prototype.doMine = function() {
  if(this.needsTarget()) this.setTarget(Finder.findHarvesterPosition(this.room.name, this.memory.role))
  if(this.hasTarget()){
    var target = this.target()
    this.getCloseAndAction(target, this.harvest(target), 1)
    if(target.energy <= 20){
      this.setMode('idle')
      this.clearTarget()
    }
    if((this.memory.role === 'miner' || this.memory.role === 'exo-miner') && this.carry.energy > 1) {
      var drop = Targeting.findCloseContainer(this.pos, 1)
      if(drop) {
        this.dumpResources(drop)
      }
    }
  } else {
    this.setMode('idle')
  }
  if(this.isFull()) this.setMode('idle')
}



