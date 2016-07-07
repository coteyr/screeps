/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-01 19:58:52
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-06 13:52:08
*/

'use strict';


StructureTower.prototype.tick = function() {
  this.setupMemory();
  this.assignMode();
  this.doWork();
}

StructureTower.prototype.setupMemory = function() {
  if(!this.room.memory.towers) {
    this.room.memory.towers = {};
  }
  if (!this.room.memory.towers[this.id]) {
    this.room.memory.towers[this.id] = {}
    this.memory = this.room.memory.towers[this.id]
  } else {
    this.memory = this.room.memory.towers[this.id];
  }
}

StructureTower.prototype.assignMode = function() {
  if(!this.memory.mode) {
    this.setMode('idle')
  }
  if(this.memory.mode === 'idle') {
    if(this.energy < this.energyCapacity) {
      this.setMode('wait-energy')
    } else {
    this.setMode('idle')
    }
  }

}
StructureTower.prototype.doWork = function() {
  if(this.memory.mode === 'wait-energy') {
    this.doWaitEnergy()
  }
  if(_.size(this.room.find(FIND_HOSTILE_CREEPS)) > 0) {
    this.doAttackInvaders()
  } else {
    Log.info('here');
    this.doRepairs()
  }
}

StructureTower.prototype.doWaitEnergy = function() {
  if(this.energy < this.energyCapacity) {
    if (this.memory.call_for_energy) {
      this.memory.call_for_energy = this.memory.call_for_energy + 0.1
    } else {
      this.memory.call_for_energy = 1
    }
  } else {
    delete this.memory.call_for_energy
    this.setMode('idle')
  }
}

StructureTower.prototype.doAttackInvaders = function() {
  var hostiles = this.room.find(FIND_HOSTILE_CREEPS);
    if(hostiles.length > 0) {
        var username = hostiles[0].owner.username;
        Game.notify('User ${username} spotted in room ');
        this.attack(hostiles[0]);
    }
}

StructureTower.prototype.doRepairs = function() {
  Log.info("Do repairs")
   var target = this.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function(object){
           return ((object.hits < object.hitsMax / 4 &&  object.structureType != 'constructedWall') || (object.hits < 10000 &&  object.structureType === 'constructedWall'));
        }
    });
   if(this.target) {
    Log.info("I have a target")
   }
   this.repair(target)
}
