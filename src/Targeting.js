/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-03 11:36:42
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-09 12:02:42
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

  nearestHostalCreep: function(pos) {
    var target = pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    return target;
  },

  nearestHostalSpawn: function(pos) {
    var target = pos.findClosestByRange(FIND_HOSTILE_SPAWNS)
    return target
  },

  nearestHostalStructure: function(pos) {
    return nearestNonController(pos, FIND_HOSTILE_STRUCTURES)
  },

  nearestStructure: function(pos) {
    return nearestNonController(pos, FIND_STRUCTURES)
  },

  nearestNonController: function(pos, type) {
    var target = pos.findClosestByRange(type, {
        filter: function(object) {
          return object.structureType !== 'controller';
        }
      });
    return target
  },


  nearestHostalAnything: function(pos) {
    var target = this.nearestHostalCreep(pos)
    if(target) {
      return target
    }
    target = nearestHostalSpawn(pos);
    if(target) {
      return target
    }
    target = nearestHostalStructure(pos);
    if (target) {
      return target
    }
    target = nearestStructure(pos);
    if (target) {
      return target
    }
  },

  nearByStructures: function(pos) {
    if (_.size(pos.findInRange(FIND_STRUCTURES, 1)) > 0) {
      return pos.findClosestByRange(FIND_STRUCTURES)
    }
  }

}
module.exports = Targeting;
