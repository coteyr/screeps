/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 02:56:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-05 20:17:29
*/

'use strict';

Creep.prototype.assignMinerTasks = function() {
  if(!this.memory.mode) {
    this.setMode('idle')
  }
  if(this.memory.mode == 'idle') {
    if(this.carry.energy < this.carryCapacity) {
      this.setMode('mine');
    } else {
      this.setMode('send');
    }
  }
}

Creep.prototype.doSend = function() {
  var found = this.room.lookForAtArea(LOOK_CREEPS, this.pos.y - 1, this.pos.x - 1 , this.pos.y + 1, this.pos.x + 1, true);
  Log.debug(JSON.stringify(found));
  var me = this;
  if(found.length > 1) {
    _.filter(found, (f) => f.creep.memory.role != 'miner').some(function(f) {
      me.transfer(f.creep, RESOURCE_ENERGY);
      me.setMode('idle')
      // f.creep.memory.mode = 'transfer'
      // f.creep.memory.mode = 'idle'
    })
  }
  if(this.carry.energy == 0) {
    this.setMode('idle')
  }
}
