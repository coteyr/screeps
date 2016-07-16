/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-15 21:37:10
*/

'use strict';



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

