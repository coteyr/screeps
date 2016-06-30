/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-30 14:52:57
*/

'use strict';

Creep.prototype.assignHarvesterTasks = function() {
  if(!this.memory.mode) {
    this.memory.mode = 'idle'
  }
  if(this.memory.mode == 'idle') {
    if(this.carry.energy < this.carryCapacity) {
      this.memory.mode = 'mine';
    } else if(this.room.energyAvailable < this.room.energyCapacityAvailable){
      this.memory.mode = 'store';
    } else {
      this.memory.mode = 'noop'
    }
  }
}

Creep.prototype.doMine = function() {
  if(!this.memory.assigned_position) {
    this.findSourcePosition()
  } else if(this.memory.assigned_position.x != this.pos.x || this.memory.assigned_position.y != this.pos.y) {
    this.goto(this.memory.assigned_position.x, this.memory.assigned_position.y, 0)
  } else {
    var source = Game.getObjectById(this.memory.assigned_position.source.id);
    this.harvest(source)
  }
  if(this.carry.energy >= this.carryCapacity && this.pos.x == this.memory.assigned_position.x && this.pos.y == this.memory.assigned_position.y ) {
    this.memory.mode = 'idle'
  }
}

Creep.prototype.doStore = function() {
  var creep = this;
  Object.keys(this.room.memory.my_spawns).forEach(function(key, index) {
      var spawn = Game.getObjectById(creep.room.memory.my_spawns[key].id);
      if(spawn.energy < spawn.energyCapacity) {
        if(!creep.pos.inRangeTo(spawn.pos.x, spawn.pos.y, 1)) {
          creep.goto(spawn.pos.x, spawn.pos.y, 1)
        } else {
          creep.transfer(spawn, RESOURCE_ENERGY)
          creep.memory.mode = 'idle'
        }
      }
    }, this.memory.my_spawns);
}

Creep.prototype.findSourcePosition = function() {
  var creep = this
  if(this.room.memory.sources) {
    Object.keys(this.room.memory.sources).some(function(key, index) {
      var position = creep.room.memory.sources[key]
      if(!position.taken) {
        creep.room.memory.sources[key].taken = true
        creep.memory.assigned_position = creep.room.memory.sources[key]
        return true
      }
    }, creep.room.memory.sources);
    if(!creep.memory.assigned_position) {
      Log.warn("All mining spots reserved, cleaning up")
      Object.keys(this.room.memory.sources).some(function(key, index) {
        var position = creep.room.memory.sources[key]
        delete creep.room.memory.sources[key].taken
      }, creep.room.memory.sources);
    }
  }
}
