/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-03 09:32:05
*/

'use strict';

Creep.prototype.assignBuilderTasks = function() {
   if(this.modeIs('idle')) {
    if(this.room.controller.level < 2) {
       if(this.carry.energy === 0) {
        this.setMode('mine')
      } else {
        this.setMode('build')
      }
    } else {
      if(this.carry.energy < this.carryCapacity) {
        this.setMode('pickup')
      } else if(this.carry.energy >= this.carryCapacity  && this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)) {
        this.setMode('build')
      } else if(this.carry.energy >= this.carryCapacity) {
        this.setMode('repair')
      }
    }
  }
}

Creep.prototype.doBuild = function() {
  if(this.carry.energy >= 1) {
    if(this.needsTarget()) {
      this.setTarget(this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES))
    }
    if(this.hasTarget()) {
      var target =  this.target()
      Log.debug("I have target " + target.id)
      if (this.moveCloseTo(target.pos.x, target.pos.y, 3)) {
        Log.debug("I am close enough")
         if (this.build(target) == ERR_INVALID_TARGET) {
          this.move(RIGHT)
         }
      }
    } else {
      this.setMode('repair');
    }
  }
  if(this.carry.energy == 0) {
    this.setMode('idle');
  }
}

Creep.prototype.doRepair = function() {
  var creep = this
  if(this.carry.energy >= 1) {
    if (this.needsTarget()) {
      var locations = this.room.find(FIND_STRUCTURES, {filter: function(structure) {
        if(_.includes(creep.room.demos, structure.id)) {
            return false
        }
        return structure.hits < structure.hitsMax * 0.75 && structure.structureType !== 'constructedWall'
      }})
      Log.debug("Found " + _.size(locations) + " needing repair")
      if(_.size(locations) === 0) {
        this.setMode('idle')
      }
      this.setTarget(this.pos.findClosestByRange(locations));
    }
    if(this.hasTarget()) {
      var target = this.target()
      if(target && this.moveCloseTo(target.pos.x, target.pos.y, 3)){
        Log.debug("Target: " + target.id)
        Log.debug(this.repair(target))
      }
      if(target.hits >= target.hitsMax) {
        delete this.memory.target
      }
    }
  } else {
    this.setMode('idle')
  }
}


