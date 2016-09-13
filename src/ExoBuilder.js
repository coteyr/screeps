/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-12 23:00:25
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
  if(this.modeIs('transition')) {
    // this.setMode('mine')
  } else if (this.modeIs('idle')) {
    if (this.carry.energy === 0 && !this.room.carrierReady()) {
      this.clearTarget()
      var target = Finder.findExclusiveDropedEnergy(this.room.name)
      if(target) {
        if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) this.pickup(target)
      } else {
        this.setMode('mine')
      }
    } else if (this.carry.energy === 0 && this.room.carrierReady()) {
      this.clearTarget()
      this.setMode('pickup')
    } else {
      this.clearTarget()
      this.setMode('build')
    }
  }
}

