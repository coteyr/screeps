/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-20 04:14:14
*/

'use strict';

Creep.prototype.assignMassUpgraderTasks = function() {
  if(this.modeIs('idle')) {
    if(this.carry.energy < this.carryCapacity && this.room.storage && this.room.storage.storedEnergy() >= 1000) {
      this.setMode('skim')
    } else if(this.carry.energy >= this.carryCapacity) {
      this.setMode('upgrade')
    }
  }
  if(this.room.storage.storedEnergy < 1000) {
    this.steMode('recycle')
  }
}



