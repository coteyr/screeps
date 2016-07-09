/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-01 19:58:52
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-08 23:37:11
*/

'use strict';

_.merge(StructureTower.prototype, EnergyStructure.prototype);

StructureTower.prototype.energyCallModifier = 2 // higher then normal for defense

StructureTower.prototype.doWork = function() {
  if(this.memory.mode === 'wait-energy') {
    this.doWaitEnergy()
  }
  if(_.size(this.room.find(FIND_HOSTILE_CREEPS)) > 0) {
    this.doAttackInvaders()
  } else {
    this.doRepairs()
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
   var target = this.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function(object){
           return ((object.hits < object.hitsMax / 4 &&  object.structureType != 'constructedWall') || (object.hits < 10000 &&  object.structureType === 'constructedWall'));
        }
    });
   if(target) {
     this.repair(target)
   }

}

StructureTower.prototype.memory = undefined;
