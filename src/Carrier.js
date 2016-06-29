/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 10:23:42
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-28 16:10:52
*/

'use strict';

Creep.prototype.assignCarrierTasks = function() {
  if(!this.memory.mode) {
    this.memory.mode = 'idle'
  }
  if(this.memory.mode == 'idle') {
    if(this.ticksToLive < 200) {
      this.memory.mode = 'recharge'
    } else if(this.carry.energy < this.carryCapacity) {
      this.memory.mode = 'pickup';
    } else if(this.carry.energy >= this.carryCapacity) {
      this.memory.mode = 'transfer';
    }
  }
}
Creep.prototype.doWaitEnergy = function() {
  if(this.carry.energy < this.carryCapacity) {
    this.memory.call_for_energy = true
  } else {
    delete this.memory.call_for_energy
    this.memory.mode = 'idle'
  }
}
Creep.prototype.doTransfer = function() {
  var me = this;
  if(!this.memory.target){
  Object.keys(this.room.memory.my_spawns).forEach(function(key, index) {
      var spawn = Game.getObjectById(me.room.memory.my_spawns[key].id);
      if (spawn.memory.call_for_energy && spawn.memory.call_for_energy != 1) {
        me.memory.target = spawn
        spawn.memory.call_for_energy = 1
      }
    }, this.memory.my_spawns);
  }
  if (!this.memory.target) {

    _.filter(Game.creeps).forEach(function(creep) {
      if(creep.my && creep.memory.call_for_energy) {
        me.memory.target = creep
        creep.memory.call_for_energy = 1
      }
    });
  }
  if (this.memory.target) {
    if(!this.pos.inRangeTo(this.memory.target.pos.x, this.memory.target.pos.y, 1)) {
      this.goto(this.memory.target.pos.x, this.memory.target.pos.y, 1)
    } else {
      var target = Game.getObjectById(this.memory.target.id);
      if(target && target.carry && target.carry.energy < target.carryCapacity && this.carry.energy > 0) {
        // creep
        this.transfer(target, RESOURCE_ENERGY)
      } else if(target && target.energy < target.energyCapacity) {
        // spawner
        this.transfer(target, RESOURCE_ENERGY)
      } else {
        this.memory.mode = 'idle'
        delete this.memory.target
      }
      if(this.carry.energy == 0) {
        target.memory.call_for_energy = true
      }
    }
  }
  if(this.carry.energy <= 0) {
    this.memory.mode = 'idle'
    delete this.memory.target
  }
}

Creep.prototype.doFill = function() {
  if(!this.memory.target_miner) {
    this.memory.mode = 'idle'
  }
  if(this.carry.energy >= this.carryCapacity) {
    this.memory.mode = 'idle'
  }
  if(!Game.getObjectById(this.memory.target_miner.id)) {
    Log.warn(this.name + " is missing their miner, reassigning")
    this.memory.mode = 'idle'
    delete this.memory.target_miner
  } else {
    if(!this.pos.inRangeTo(Game.getObjectById(this.memory.target_miner.id).pos, 1)) {
      Log.warn("No longer in range")
      this.memory.mode = 'idle'
      delete this.memory.target_miner
    }
  }

}

Creep.prototype.doPickup = function() {
  if(this.carry.energy < this.carryCapacity) {
    var me = this
    if(!this.memory.target_miner) {
      _.filter(Game.creeps).forEach(function(creep) {
        if(creep.my && creep.carry.energy >= creep.carryCapacity) {
          me.memory.target_miner = creep
        }
      });
    }
  }

   if(this.memory.target_miner && !this.pos.inRangeTo(this.memory.target_miner.pos.x, this.memory.target_miner.pos.y, 1)) {
      this.goto(this.memory.target_miner.pos.x, this.memory.target_miner.pos.y, 1)
    } else {
      if(this.carry.energy < this.carryCapacity) {
        this.memory.mode = 'fill'
      } else {
        this.memory.mode = 'idle'
      }
    }

}
