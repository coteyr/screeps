/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-01 19:58:52
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-29 12:20:19
*/

'use strict';

_.merge(StructureTower.prototype, EnergyStructure.prototype);

StructureTower.prototype.energyCallModifier = 3 // higher then normal for defense

StructureTower.prototype.doWork = function() {
  if(this.modeIs('wait-energy')) {
    this.doWaitEnergy()
  }
  if(_.size(this.room.find(FIND_HOSTILE_CREEPS)) > 0) {
    this.doAttackInvaders()
  } else {
    this.doRepairs()
  }
}


StructureTower.prototype.doAttackInvaders = function() {
  if (this.needsTarget()) {
    var hostiles = this.pos.findInRange(FIND_HOSTILE_CREEPS, 20)/*, {filter: function(creep){
      return  true;
    }});*/
    if(hostiles.length > 0) {
      this.setTarget(hostiles[0])
    }
  }
  if(this.hasTarget()) {
    var target = this.target()
    this.attack(target);
  } else {
    this.doRepairs()
  }
}

StructureTower.prototype.doRepairs = function() {
  var tower = this
  if(!tower.room.memory.demos) tower.room.memory.demos = []
  var target = this.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function(object){
          return ((object.hits < object.hitsMax / 4 &&  object.structureType !== 'constructedWall' && object.structureType !== 'rampart') || (object.hits < 10000 &&  object.structureType === 'constructedWall') || (object.hits < 10000 && object.structureType === 'rampart'));
        }
    });
   if(target) {
     this.repair(target)
   } else {
    if(this.room.buildWalls() && this.storedEnergy() >= 0.90 * this.possibleEnergy()) {
      var smallest = 0
      var targets = this.room.find(FIND_STRUCTURES, {filter: function(s){
        return s.structureType === 'constructedWall' || s.structureType === 'rampart'
      }})
      var target = null
      targets.forEach(function(t){
        if((t.hitsMax - t.hits) > smallest) {
          target = t
          smallest = t.hitsMax - t.hits
        }
      })
      if(target) {
        this.repair(target)
      }
    }
   }

}

StructureTower.prototype.memory = undefined;
