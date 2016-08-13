/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-13 00:35:33
*/

'use strict';

Creep.prototype.assignHarvesterTasks = function() {
  if(this.hasRoom()) this.setMode('mine')
  if(_.size(this.room.find(FIND_CONSTRUCTION_SITES)) >= 5) this.setMode('build')
  if(_.size(this.room.find(FIND_CONSTRUCTION_SITES)) < 5 && !this.isEmpty() && this.room.isFull()) this.setMode('upgrade');
  if(_.size(this.room.find(FIND_CONSTRUCTION_SITES)) < 5 && !this.isEmpty() && this.room.hasRoom()) this.setMode('transfer');
}

Creep.prototype.doMine = function() {
  if(this.needsTarget()) this.setTarget(Finder.findSourcePosition(this.room.name))
  if(this.hasTarget()){
    var target = this.target()
    this.getCloseAndAction(target, this.harvest(target), 1)
    if(target.energy <= 20) this.setMode('idle')
  } else {
    this.setMode('idle')
  }
  if(this.isFull()) this.setMode('idle')
}



