/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-11 07:23:28
*/

'use strict';

Creep.prototype.assignExoClaimerTasks = function() {
  if(!this.memory.home) {
    this.memory.home = this.room.name
  }
  if(this.room.name === this.memory.claim) {
    // I am in the remote room
    this.assignRemoteExoClaimerTasks()
  } else if (this.room.name === this.memory.home) {
    this.assignHomeExoClaimerTasks()
    // I am home
  } else {
    // I have no clue where I am

  }
}

Creep.prototype.assignHomeExoClaimerTasks = function() {
  this.setMode('exop');
}

Creep.prototype.assignRemoteExoClaimerTasks = function() {
  if(this.memory.mode === 'transition') {
    // this.setMode('mine')
  } else {
      this.setMode('claim')
  }
}

Creep.prototype.doClaim = function() {
  if(this.moveCloseTo(this.room.controller.pos.x, this.room.controller.pos.y, 1)) {
    this.claimController(this.room.controller)
  }
}

Creep.prototype.doExOpClaim = function() {
  this.gotoRoom(this.memory.claim)
}
