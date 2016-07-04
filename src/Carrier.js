/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 10:23:42
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-04 08:55:21
*/

'use strict';

Creep.prototype.assignCarrierTasks = function() {
  if(!this.memory.mode) {
    this.memory.mode = 'idle'
  }
  if(this.memory.mode === 'idle') {
    if(this.carry.energy < this.carryCapacity) {
      this.memory.mode = 'pickup';
    } else if(this.carry.energy >= this.carryCapacity) {
      this.memory.mode = 'transfer';
    }
  }
}
Creep.prototype.doWaitEnergy = function() {
  if(this.carry.energy < this.carryCapacity) {
    if (this.memory.call_for_energy) {
      this.memory.call_for_energy = this.memory.call_for_energy + 1
    } else {
      this.memory.call_for_energy = 1
    }
  } else {
    delete this.memory.call_for_energy
    this.memory.mode = 'idle'
  }
}

Creep.prototype.doTransfer = function() {
  var me = this;
  if(!this.memory.target){
    var possibilities = _.union({}, this.room.myCreeps(), this.room.memory.my_spawns, this.room.memory.my_extensions, this.room.memory.my_towers)
    this.memory.target = Targeting.getTransferTarget(possibilities);
  }
  if (this.memory.target) {
    var target = Game.getObjectById(this.memory.target.id);
    if(target && target.memory) {
      target.memory.call_for_energy = 0
      if(this.moveCloseTo(this.memory.target.pos.x, this.memory.target.pos.y, 1)) {
        var energy = this.carry.energy
        this.transfer(target, RESOURCE_ENERGY)

        target.memory.call_for_energy = 0
        delete this.memory.target
        if (this.carry.energy <= 0) {
          this.memory.mode = 'idle'
        }
      }
    }
  }
}

Creep.prototype.doFill = function() {
  if(!this.memory.target_miner) {
    this.memory.mode = 'idle'
    return false;
  }
  if(this.carry.energy >= 0) { //this.carryCapacity) {
    this.memory.mode = 'idle'
    return false
  }
  if(!Game.getObjectById(this.memory.target_miner.id)) {
    Log.warn(this.name + " is missing their miner, reassigning")
    this.memory.mode = 'idle'
    delete this.memory.target_miner
  } else {
    var miner = Game.getObjectById(this.memory.target_miner.id);
    if (!miner.memory.mode === 'send') {
      // get more energy from a different miner
      delete this.memory.target_miner
      this.memory.mode = 'idle'
    }
    if(this.memory.target_miner && !this.pos.inRangeTo(Game.getObjectById(this.memory.target_miner.id).pos, 1)) {
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
        if(creep.my && creep.memory.mode === 'send') {
          me.memory.target_miner = creep
        }
      });
    }
  }
  if(this.memory.target_miner && this.moveCloseTo(this.memory.target_miner.pos.x, this.memory.target_miner.pos.y, 1)) {
    if(this.carry.energy < this.carryCapacity) {
      this.memory.mode = 'fill'
    }
  }
  if(this.carry.energy >= this.carryCapacity) {
    this.memory.mode = 'idle'
  }
}
