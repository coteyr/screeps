/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-29 02:15:17
*/

'use strict';

Creep.prototype.assignUpgraderTasks = function() {
  if(this.modeIs('idle')) {
    if(this.carry.energy < this.carryCapacity && this.room.carrierReady()) {
      this.setMode('skim')
    } else if(this.carry.energy < this.carryCapacity) {
      this.setMode('wait-energy')
    } else if(this.carry.energy >= this.carryCapacity) {
      this.setMode('upgrade')
    }
  }
}

Creep.prototype.doUpgrade = function() {
  if(this.carry.energy >= 1) {
    if(this.moveCloseTo(this.room.controller.pos.x, this.room.controller.pos.y, 3)) {
      this.upgradeController(this.room.controller)
    }
  } else {
    this.setMode('idle')
  }
}

Creep.prototype.doSkim = function() {
  var buffers = _.filter(this.room.memory.my_storages, function(object) {
      var structure = Game.getObjectById(object.id)
      // Log.info(JSON.stringify(structure))
      return structure.storedEnergy() >= 300;
    })
    if(_.size(buffers) > 0) {
      if(this.moveCloseTo(buffers[0].pos.x, buffers[0].pos.y, 1)) {
        var structure = Game.getObjectById(buffers[0].id)
        this.withdraw(structure, RESOURCE_ENERGY)
      }
    } else {
      this.setMode('pickup')
    }
    if(this.carry.energy >= this.carryCapacity) {
      this.setMode('idle')
    }
}


