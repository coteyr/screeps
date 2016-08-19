/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-17 17:54:25
*/

'use strict';

Creep.prototype.assignHarvesterTasks = function() {
  if(this.hasRoom()) this.setMode('mine')
  if(_.size(this.room.find(FIND_CONSTRUCTION_SITES)) >= 5 && !this.isEmpty() && this.room.isFull()) this.setMode('build')
  if(_.size(this.room.find(FIND_CONSTRUCTION_SITES)) < 5 && !this.isEmpty() && this.room.isFull()) this.setMode('upgrade');
  if(!this.isEmpty() && this.room.hasRoom()) this.setMode('transfer');
}

Creep.prototype.doMine = function() {
  if(this.needsTarget()) this.setTarget(Finder.findSourcePosition(this.room.name, this.memory.role))
  if(this.hasTarget()){
    var target = this.target()
    this.getCloseAndAction(target, this.harvest(target), 1)
    if(target.energy <= 20) this.setMode('idle')
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



