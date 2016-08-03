/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 02:56:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-03 09:59:11
*/

'use strict';

Creep.prototype.assignBigMinerTasks = function() {
  if(this.ticksToLive >= 1499){
    this.killSmallMiners() // first tick
  }
  if(this.modeIs('idle')) {
    if(this.carry.energy < this.carryCapacity) {
      this.setMode('big-mine');
    } else {
      this.setMode('send');
    }
  }
}

Creep.prototype.doBigMine = function() {
  if(this.needsTarget()) {
    this.setTarget(Finder.findLargestSource(this.room.name))
  }
  if(this.hasTarget()) {
    var target = this.target()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) {
      this.harvest(target)
    }
    if(target.energy < 20 && target.ticksToRegeneration > 20) {
      this.clearTarget()
      this.doBigSend()
    }
    if(this.carry.energy >= this.carryCapacity) {
      this.setMode('big-send')
      this.doBigSend()
    }
  }
}

Creep.prototype.killSmallMiners = function() {
  Finder.findCreeps('miner', this.room.name).forEach(function(creep){
    creep.setMode('recycle')
  })
}

Creep.prototype.doBigSend = function() {
  var containers = this.pos.findInRange(FIND_STRUCTURES, 1, {filter: {structureType: STRUCTURE_CONTAINER}})
  if (_.size(containers) > 0) {
    this.setMode('big-mine')
    this.transfer(containers[0], RESOURCE_ENERGY)
  } else {
    this.setMode('idle')
  }
}
