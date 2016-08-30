/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-30 14:02:48
*/

'use strict';

Creep.prototype.setupExoCarrierMemory = function() {
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
}

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

