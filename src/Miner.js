/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 02:56:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-16 09:05:54
*/

'use strict';

Creep.prototype.assignMinerTasks = function() {
  if(this.modeIs('idle')) {
    if(this.carry.energy < this.carryCapacity) {
      this.setMode('mine');
    } else {
      this.setMode('send');
    }
  }
}

Creep.prototype.doBroadcast = function() {
  if(this.hasRoom()) this.setMode('idle')
  return true;

}

Creep.prototype.doSend = function() {
  var containers = this.pos.findInRange(FIND_STRUCTURES, 3, {filter: {structureType: STRUCTURE_CONTAINER}}) // function(c) {
  //  c.storedEnergy() < c.possibleEnergy() - this.carry.energy && c.structureType === STRUCTURE_CONTAINER && c.isActive()
  //});
  if (_.size(containers) > 0) {
    this.getCloseAndAction(containers[0], this.transfer(containers[0], RESOURCE_ENERGY), 1) // this.setMode('idle')


  } else {
    var found = this.room.lookForAtArea(LOOK_CREEPS, this.pos.y - 1, this.pos.x - 1 , this.pos.y + 1, this.pos.x + 1, true);
    Log.debug(JSON.stringify(found));
    var me = this;
    if(found.length > 1) {
      _.filter(found, (f) => f.creep.memory.role != 'miner' && f.creep.memory.role != 'harvester').some(function(f) {
        me.transfer(f.creep, RESOURCE_ENERGY);
        me.setMode('idle')
        // f.creep.memory.mode = 'transfer'
        // f.creep.memory.mode = 'idle'
      })
    }
  }
  if(this.carry.energy == 0) {
    this.setMode('idle')
  }
}
