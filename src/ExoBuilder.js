/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-17 21:19:36
*/

'use strict';

Creep.prototype.setupExoBuilderMemory = function() {
  this.chooseExoTarget('build')
}

Creep.prototype.assignHomeExoBuilderTasks = function() {
  if(this.carry.energy <= 0) {
    this.setMode('leave');
  } else {
    this.setMode('transfer');
  }
}

Creep.prototype.assignTravelExoBuilderTasks = function() {
  this.setMode('leave')
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

