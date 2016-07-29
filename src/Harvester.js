/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-29 02:14:54
*/

'use strict';

Creep.prototype.assignHarvesterTasks = function() {
  if(this.modeIs('idle')) {
    if (_.size(Finder.findCreeps('miner', this.room.name)) >= 2 && this.room.controller.level >= 4){
      this.setMode('recycle')
    } else if(this.carry.energy < this.carryCapacity) {
      this.setMode('mine')
    } else if(this.carry.energy >= this.carryCapacity && this.room.carrierReady()) {
      this.setMode('transfer');
    } else if(this.carry.energy >= this.carryCapacity && !this.room.carrierReady()){
      this.setMode('upgrade')
    } else {
      this.setMode('noop')
    }
  }
}

Creep.prototype.doMine = function() {
  if(!this.memory.assigned_position) {
    this.findSourcePosition()
  }
  if(this.memory.assigned_position && this.moveCloseTo(this.memory.assigned_position.pos.x, this.memory.assigned_position.pos.y, 1)) {
    var source = Game.getObjectById(this.memory.assigned_position.id);
    this.harvest(source)
  }
  if(this.carry.energy >= this.carryCapacity) { // && this.pos.x == this.memory.assigned_position.x && this.pos.y == this.memory.assigned_position.y ) {
    this.setMode('idle')
  }
}

/*Creep.prototype.doStore = function() {
  var creep = this;
  var target = undefined;
  Object.keys(this.room.memory.my_spawns).forEach(function(key, index) {
      var spawn = Game.getObjectById(creep.room.memory.my_spawns[key].id);
      if(spawn.energy < spawn.energyCapacity) {
        target = spawn;
      }
    }, this.memory.my_spawns);
  if(!target) {
    Object.keys(this.room.memory.my_extensions).forEach(function(key, index) {
      var extension = Game.getObjectById(creep.room.memory.my_extensions[key].id);
      if(extension.energy < extension.energyCapacity) {
        target = extension;
      }
    }, this.memory.my_extensions);
  }
  if(target) {
    if(creep.moveCloseTo(target.pos.x, target.pos.y, 1)) {
      creep.transfer(target, RESOURCE_ENERGY)
      creep.memory.mode = 'idle'
    }
  }
}*/

Creep.prototype.findSourcePosition = function() {
  var creep = this
  if(this.room.memory.my_sources) {
    Object.keys(this.room.memory.my_sources).some(function(key, index) {
      var position = Game.getObjectById(creep.room.memory.my_sources[key].id)
      if(!position.mined()) {
        creep.memory.assigned_position = creep.room.memory.my_sources[key]
        return true
      }
    }, creep.room.memory.my_sources);
    if(!creep.memory.assigned_position) {
      Log.warn("All mining spots mined")
      Object.keys(this.room.memory.my_sources).some(function(key, index) {
        // find some other criteria
      }, creep.room.memory.my_sources);
      // this.room.reset()
      creep.doNoop()
    }
  }
}
