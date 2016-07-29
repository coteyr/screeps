/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-29 02:07:06
*/

'use strict';


Creep.prototype.assignTravelExoClaimerTasks = function() {
  if(this.mode() !== 'transition') {
    this.setMode('leave')
  }
}

Creep.prototype.setupExoClaimerMemory = function() {
  this.chooseExoTarget('claim')
}


Creep.prototype.assignHomeExoClaimerTasks = function() {
  this.setMode('leave');
}

Creep.prototype.assignRemoteExoClaimerTasks = function() {
  if(this.mode() === 'transition') {
    // this.setMode('mine')
  } else {
    this.setMode('claim')
  }
}

Creep.prototype.doReserve = function() {
  if(this.moveCloseTo(this.room.controller.pos.x, this.room.controller.pos.y, 1)) {
    this.reserveController(this.room.controller)
  }
}

Creep.prototype.doClaim = function() {
  if(this.moveCloseTo(this.room.controller.pos.x, this.room.controller.pos.y, 1)) {
    this.claimController(this.room.controller)
  }
}

