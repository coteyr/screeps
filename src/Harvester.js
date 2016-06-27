/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 20:51:54
*/

'use strict';

Creep.prototype.assignHarvesterTasks = function() {
  if(!this.memory.mode) {
    this.memory.mode = 'idle'
  }
  if(this.memory.mode == 'idle') {
    if(this.carry.energy < this.carryCapacity) {
      this.memory.mode = 'mine';
    } else {
      this.memory.mode = 'store';
    }
  }
}

Creep.prototype.doMine = function() {
  if(!this.memory.assigned_position) {
    this.findSourcePosition()
  } else {
    this.goto(this.memory.assigned_position.x, this.memory.assigned_position.y)
  }
}

Creep.prototype.doStore = function() {
  Object.keys(this.memory.my_spawns).forEach(function(key, index) {
      var spawn = Game.getObjectById(this[key].id);
      if(spawn.energy < spawn.energyCapacity) {

      }
    }, this.memory.my_spawns);
}

Creep.prototype.findSourcePosition = function() {
  creep = this
  if(this.room.memory.sources) {
    Object.keys(this.room.memory.sources).some(function(key, index) {
      position = this.room.memory.sources[key]
      if(!position.taken) {
        creep.room.memory.sources[key].takes = true
        creep.memory.assigned_position = creep.room.memory.sources[key]
        return true
      }
    }, this.room.memory.sources);
  }
}
