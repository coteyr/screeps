/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 02:56:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-30 20:48:13
*/

'use strict';

Creep.prototype.assignMinerTasks = function() {
  if(!this.memory.mode) {
    this.memory.mode = 'idle'
  }
  if(this.memory.mode == 'idle') {
    if(this.carry.energy < this.carryCapacity || this.pos.x != this.memory.assigned_position.x || this.pos.y != this.memory.assigned_position.y ) {
      this.memory.mode = 'mine';
    } else {
      this.memory.mode = 'send';
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
      me.memory.mode = 'idle'
      // f.creep.memory.mode = 'transfer'
      // f.creep.memory.mode = 'idle'
    })
  }
  if(this.carry.energy == 0) {
    this.memory.mode = 'idle'
  }
}
