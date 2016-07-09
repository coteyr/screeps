/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-03 11:36:42
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-09 11:38:15
*/

'use strict';

var Targeting = {
  getTransferTarget: function(objects, pos) {
    var result;
    var biggest = 0;
    // This may be doable with _.maxBy()
    Object.keys(objects).forEach(function(key, index) {
      var target = Game.getObjectById(objects[key].id);
      if(target.memory) {
        if (target.memory.call_for_energy) {
          if (target.memory.call_for_energy >= biggest) {
            result = target;
            biggest = target.memory.call_for_energy
          }
        }
      } else {
       Log.warn("No Memory for: " + target.id)
      }
    }, objects);
    return result
  },

  nearestHostalAnything: function(pos) {
    var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(target) {
      return target
    }
    target = this.pos.findClosestByRange(FIND_HOSTILE_SPAWNS)
    if(target) {
      return target
    }
    target = this.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
        filter: function(object) {
          return object.structureType != 'controller';
        }
      });
    if (target) {
      return target
    }
    target = this.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
        filter: function(object) {
          return object.structureType != 'controller';
        }
      });
    if(target) {
      return target
    }
    var target = this.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function(object) {
          return object.structureType != 'controller';
        }
      });
    if (target) {
      return target
    }
  },

  nearByStructures: function(pos) {
    if (_.size(this.pos.findInRange(FIND_STRUCTURES, 1)) > 0) {
      return this.pos.findClosestByRange(FIND_STRUCTURES)
    }
  }

}
module.exports = Targeting;
