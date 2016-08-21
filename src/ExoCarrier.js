/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-21 14:33:04
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
  this.assignHomeExoHarvesterTasks()
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
  var container = Targeting.findCloseContainer(this.pos, 1)
  if(container && container.hits < container.hitsMax) {
    this.repair(container)
  } else {
    var road = Targeting.findRoadUnderneath(this.pos)
    if(road && road.hits < road.hitsMax) {
      this.repair(road)
    } else {
      this.doGoHome()
    }
  }
  if(this.isEmpty()) {
    this.setMode('idle')
  }

}

