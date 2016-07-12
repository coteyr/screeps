/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-11 08:57:55
*/

'use strict';

Creep.prototype.assignExoBuilderTasks = function() {
  if(!this.memory.home) {
    this.memory.home = this.room.name
  }
  if(this.room.name === this.memory.build) {
    // I am in the remote room
    this.assignRemoteExoBuilderTasks()
  } else if (this.room.name === this.memory.home) {
    this.assignHomeExoBuilderTasks()
    // I am home
  } else {
    // I have no clue where I am

  }
  if(this.room.name === this.memory.home && this.carry.energy > 0) {
    this.setMode('transfer')
  }
  if(this.room.name === this.memory.home && this.memory.mode === 'mine') {
    this.setMode('idle')
  }
}

Creep.prototype.assignHomeExoBuilderTasks = function() {
  if(this.carry.energy <= 0) {
    this.setMode('exop-build');
  } else {
    this.setMode('transfer');
  }
}

Creep.prototype.assignRemoteExoBuilderTasks = function() {
  if(this.memory.mode == 'transition') {
    // this.setMode('mine')
  } else if (this.memory.mode == 'idle') {
    if (this.carry.energy === 0) {
      this.setMode('mine')
    } else {
      this.setMode('build')
    }
  }
}

Creep.prototype.doExOpBuild = function() {
  this.gotoRoom(this.memory.build)
}

