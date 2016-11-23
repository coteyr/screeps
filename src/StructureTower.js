/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-01 19:58:52
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-16 15:41:10
*/

'use strict';

_.merge(StructureTower.prototype, EnergyStructure.prototype);

StructureTower.prototype.energyCallModifier = 3 // higher then normal for defense

StructureTower.prototype.doWork = function() {
  if(this.modeIs('wait-energy')) {
    this.doWaitEnergy()
  }
  if(_.size(this.room.find(FIND_HOSTILE_CREEPS)) > 0) {
    this.doHeals()
    this.doAttackInvaders()
  } else {
    this.doRepairs()
  }
}


StructureTower.prototype.doAttackInvaders = function() {
  let tower = this
  if (this.needsTarget()) {
    var hostiles = this.pos.findInRange(FIND_HOSTILE_CREEPS, 50)/*, {filter: function(creep){
      return  true;
    }});*/
    hostiles.forEach(function(invader) {
      if(invader.hasPart(HEAL)) tower.setTarget(invader)
    })
    if(this.needsTarget() && hostiles.length > 0) {
      this.setTarget(hostiles[0])
    }
  }
  if(this.hasTarget()) {

    var target = this.target()
    this.memory.old_hits >= target.hits
    if (target.hits > this.memory.old_hits) {
      this.clearTarget()
      return false
    }
    this.attack(target);
  } else {
    this.doRepairs()
  }
}

StructureTower.prototype.doRepairs = function() {
  var tower = this
  let wallMax = (1000000/8) * this.room.controller.level
  if(!tower.room.memory.demos) tower.room.memory.demos = []
  var target = this.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function(object){
          return ((object.hits < object.hitsMax / 4 &&  object.structureType !== 'constructedWall' && object.structureType !== 'rampart') || (object.hits < 10000 &&  object.structureType === 'constructedWall') || (object.hits < 10000 && object.structureType === 'rampart'));
        }
    });
   if(target) {
     this.repair(target)
   } else {
    if(this.room.upgradeWalls() && this.storedEnergy() >= 0.50 * this.possibleEnergy()) {
      var smallest = 0
      var targets = this.room.find(FIND_STRUCTURES, {filter: function(s){
        return (s.hits < wallMax &&  s.structureType === 'constructedWall') || (s.hits < wallMax && s.structureType === 'rampart')
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

StructureTower.prototype.doHeals = function() {
  let tower = this
  _.filter(Game.creeps).forEach(function(creep) {
    if(creep.my && creep.room.name === tower.room.name) {
      if (creep.hits <= creep.hitsMax * 0.90) {
        tower.heal(creep)
      }

    }
  });
}

StructureTower.prototype.memory = undefined;
