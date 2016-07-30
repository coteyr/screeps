/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-01 19:58:52
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-30 07:37:12
*/

'use strict';

_.merge(StructureTower.prototype, EnergyStructure.prototype);

StructureTower.prototype.energyCallModifier = 3 // higher then normal for defense

StructureTower.prototype.doWork = function() {
  if(this.mode() === 'wait-energy') {
    this.doWaitEnergy()
  }
  if(_.size(this.room.find(FIND_HOSTILE_CREEPS)) > 0) {
    this.doAttackInvaders()
  } else {
    this.doRepairs()
  }
}


StructureTower.prototype.doAttackInvaders = function() {
  if (!this.memory.target) {
    var hostiles = this.pos.findInRange(FIND_HOSTILE_CREEPS, 16, {filter: function(creep){
      return  true;
    }});
    if(hostiles.length > 0) {
      this.memory.target = hostiles[0].id
    }
  } else {
    var target = Game.getObjectById(this.memory.target)
    if(target) {
      this.attack(target);
    } else {
      delete this.memory.target
    }
  }
}

StructureTower.prototype.doRepairs = function() {
  var tower = this
   var target = this.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function(object){
          if(_.includes(tower.room.demos, object.id)) {
            return false
          }
          return ((object.hits < object.hitsMax / 4 &&  object.structureType !== 'constructedWall' && object.structureType !== 'rampart') || (object.hits < 10000 &&  object.structureType === 'constructedWall') || (object.hits < 10000 && object.structureType === 'rampart'));
        }
    });
   if(target) {
     this.repair(target)
   }

}

StructureTower.prototype.memory = undefined;
