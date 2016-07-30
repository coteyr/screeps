/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 10:23:42
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-29 17:31:12
*/

'use strict';

Creep.prototype.assignCarrierTasks = function() {
  if(!this.mode()) {
    this.setMode('idle')
  }
  if(this.mode() === 'idle') {
    if(this.carry.energy < this.carryCapacity) {
      this.setMode('pickup');
    } else if(this.carry.energy >= this.carryCapacity) {
      this.setMode('transfer');
    }
  }
}
Creep.prototype.doWaitEnergy = function() {
  if(this.carry.energy < this.carryCapacity) {
    if (this.memory.call_for_energy) {
      this.memory.call_for_energy += 5
    } else {
      this.memory.call_for_energy = 1
    }
  } else {
    delete this.memory.call_for_energy
    this.setMode('idle')
  }
}

Creep.prototype.doTransfer = function() {
  var me = this;
  if(!this.memory.target){
    var possibilities = _.union({}, this.room.myCreeps(), this.room.memory.my_spawns, this.room.memory.my_extensions, this.room.memory.my_towers, this.room.memory.my_containers, this.room.memory.my_storages)
    this.memory.target = Targeting.getTransferTarget(possibilities, this.pos);
  }
  if (this.memory.target) {
    var target = Game.getObjectById(this.memory.target.id);
    if(target && target.memory) {
      target.memory.call_for_energy = 0
      if(!this.pos.findInRange(FIND_STRUCTURES, 1, {filter: {structureType: STRUCTURE_EXTENSION}}).some(function(ext){
        if(ext.storedEnergy() <= ext.possibleEnergy()) {
          if(me.transfer(ext, RESOURCE_ENERGY) === 0) {
            ext.memory.call_for_energy = 0
            return true
          }
        }
        return false
      })){
        if(this.moveCloseTo(this.memory.target.pos.x, this.memory.target.pos.y, 1)) {
          var energy = this.carry.energy
          this.transfer(target, RESOURCE_ENERGY)

          target.memory.call_for_energy = 0
          delete this.memory.target
          if (this.carry.energy <= 0) {
            this.setMode('idle')
          }
        }
      }
      if ((target.carry && target.carry.energy && target.carry.energy >= target.carryCapacity) || (target.energyCapacity && target.energy >= target.energyCapacity) || (target.storeCapacity && target.store[RESOURCE_ENERGY] >= target.storeCapacity)) {
        delete this.memory.target
      }
    } else {
      delete this.memory.target
    }
  }
  if(this.carry.energy <= 0) {
    this.setMode('idle')
  }
}

Creep.prototype.doFill = function() {
  if(!this.memory.target_miner || this.memory.target_miner === null) {
    this.setMode('idle')
    console.log('q')
    return false;
  }
  if(!Game.getObjectById(this.memory.target_miner.id)) {
    Log.warn(this.name + " is missing their miner, reassigning")
    this.setMode('idle')
    delete this.memory.target_miner
  } else {
    var miner = Game.getObjectById(this.memory.target_miner.id);
    if(miner.memory.role) { // is a creep miner
 /*     if (!miner.memory.mode === 'broadcast') {
        // get more energy from a different miner
        delete this.memory.target_miner
        this.setMode('idle')
      }*/
    // } else {
      miner.transfer(this, RESOURCE_ENERGY)
      this.withdraw(miner, RESOURCE_ENERGY)
      delete this.memory.target_miner
      miner.setMode('idle')
      this.setMode('idle')
    } else {
      this.withdraw(miner, RESOURCE_ENERGY)
      delete this.memory.target_miner
      this.setMode('idle')
    }
    if(this.memory.target_miner && !this.pos.inRangeTo(Game.getObjectById(this.memory.target_miner.id).pos, 1)) {
      Log.warn("No longer in range")
      this.setMode('idle')
      delete this.memory.target_miner
    }

  }
  delete this.memory.target_miner
}

Creep.prototype.doPickup = function() {
  if(this.carry.energy < this.carryCapacity) {
    if(!this.memory.target_miner) {
      if(this.memory.role == 'carrier') {
        this.memory.target_miner = Targeting.findEnergySource(this.pos, this.room, 'pickup')
      } else {
        this.memory.target_miner = Targeting.findEnergySource(this.pos, this.room, 'grab')
      }
    }
    // Log.info(this.memory.target_miner)
    if(this.memory.target_miner && this.moveCloseTo(this.memory.target_miner.pos.x, this.memory.target_miner.pos.y, 1)) {
      this.setMode('fill')
    } else if (!this.memory.target_miner && this.carry.energy > 0) {
      this.setMode('transfer')
    }
  } else { // this.carry.energy >= this.carryCapacity
    this.setMode('idle')
  }
}
