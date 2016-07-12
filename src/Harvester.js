/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-10 23:37:27
*/

'use strict';

Creep.prototype.assignHarvesterTasks = function() {
  if(!this.memory.mode) {
    this.setMode('idle')
  }
  if(this.memory.mode == 'idle') {
    if (_.size(Finder.findCreeps('miner', this.room.name)) >= 2){
      this.setMode('recycle')
    } else if(this.carry.energy < this.carryCapacity) {
      this.setMode('mine')
    } else if(this.room.energyAvailable < this.room.energyCapacityAvailable){
      this.setMode('transfer');
    } else {
      this.setMode('noop')
    }
  }
}

Creep.prototype.doMine = function() {
  if(!this.memory.assigned_position) {
    this.findSourcePosition()
  }
  if(this.moveCloseTo(this.memory.assigned_position.pos.x, this.memory.assigned_position.pos.y, 1)) {
    var source = Game.getObjectById(this.memory.assigned_position.id);
    this.harvest(source)
  }
  if(this.carry.energy >= this.carryCapacity) { // && this.pos.x == this.memory.assigned_position.x && this.pos.y == this.memory.assigned_position.y ) {
    this.setMode('idle')
  }
}

Creep.prototype.doStore = function() {
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
}

Creep.prototype.findSourcePosition = function() {
  var creep = this
  if(this.room.memory.sources) {
    Object.keys(this.room.memory.sources).some(function(key, index) {
      var position = creep.room.memory.sources[key]
      if(!position.taken) {
        creep.room.memory.sources[key].taken = true
        creep.memory.assigned_position = creep.room.memory.sources[key]

        //
        /*
        var look = this.room.lookAt(x, y);
        var me = this
        creep.room.look.forEach(function(lookObject) {
          if(lookObject.type == LOOK_CREEPS) {
            Log.warn("Spot is taken " + me.name + " can't mine there: " + x + ", " + y)
           delete creep.memory.assigned_position
          }
        }); */

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
