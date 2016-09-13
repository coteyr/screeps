/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-10 06:58:32
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
  if(!this.state()) this.setState('pick')
  if(this.stateIs('pick')) {
    this.clearTarget()
    this.setTarget(Finder.findHarvesterPosition(this.room.name, this.memory.role))
    if(this.hasTarget()) this.setState('travel')
  }
  if(this.stateIs('travel')) {
    var target = this.target()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) this.setState('harvest')
  }
  if(this.stateIs('harvest')) {
    var target = this.target()
    this.harvest(target)
    if(this.isFull()) this.setState('choose')
  }
  if(this.stateIs('choose')) {
    if(this.room.energyAvailable < this.room.energyCapacityAvailable) {
      this.clearTarget()
      this.setTarget(Targeting.getTransferTarget(this.pos, this.room))
      if(this.hasTarget()) this.setState('goto')
    } else if(this.room.needsConstruction()) {
      this.clearTarget()
      this.setTarget(Targeting.findClosestConstruction(this.pos))
      if(this.hasTarget()) this.setState('position')
    } else if(this.room.controller && this.room.controller.level < 3 && _.size(Finder.findConstructionSites(this.room.name)) < 5){
      this.setState('traverse')
    } else {
      this.clearTarget()
      this.setTarget(Targeting.findClosestRepairTarget(this.pos, this.room, this))
      if(this.hasTarget()) this.setState('travel')
    }
  }
  if(this.stateIs('traverse')) {
    if(this.moveCloseTo(this.room.controller.pos.x, this.room.controller.pos.y, 3)) this.setState('upgrade-controller')
  }
  if(this.stateIs('upgrade-controller')) {
    this.upgradeController(this.room.controller)
    if(this.isEmpty()) this.setState('pick')
  }
  if(this.stateIs('goto')){
    var target = this.target()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) this.setState('fill')
  }
  if(this.stateIs('fill')) {
      var target = this.target()
      this.transfer(target, RESOURCE_ENERGY)
      if(this.hasSome()) this.setState('choose')
      if(this.isEmpty()) this.setState('pick')
  }
  if(this.stateIs('position')) {
    var target = this.target()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 3)) this.setState('build')
  }
  if(this.stateIs('build')) {
    var target = this.target()
    this.build(target)
    if(this.isEmpty()) this.setState('pick')
    if(this.needsTarget()) this.setState('pick')
  }
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



