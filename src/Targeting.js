/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-03 11:36:42
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-29 10:42:09
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
    var target = pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    console.log(JSON.stringify(target))
    return target;
  },

  nearestHostalSpawn: function(pos) {
    var target = pos.findClosestByRange(FIND_HOSTILE_SPAWNS)
    return target
  },

  nearestHostalStructure: function(pos) {
    return this.nearestNonController(pos, FIND_HOSTILE_STRUCTURES)
  },

  nearestStructure: function(pos) {
    return this.nearestNonController(pos, FIND_STRUCTURES)
  },

  nearestHostalRampart: function(pos) {
    var target = pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {filter: function(object){
      return object.structureType === 'rampart'
    }});
    return target
  },

  nearestNonController: function(pos, type) {
    var target = pos.findClosestByPath(type, {
        filter: function(object) {
          return object.structureType !== 'controller' &&object.structureType !== 'road';
        }
      });
    return target
  },

  nearestHostalSpread: function(pos) {
    var structures = pos.findClosestByPath(FIND_STRUCTURES, {filter: {
      function(object) {
        console.log('g')
        console.log(Memory.ignores)
        console.log(_.includes(Memory.spread_targets, object.id))
        // return !_.includes(Memory.ignores, object.id)
      }
    }})
    console.log(structures)
    if (_.size(structures)) {
      Memory.spread_targets.push(structures[0].id)
      return structures[0]
    }
  },


  nearestHostalAnything: function(pos) {
    var target = this.nearestHostalCreep(pos)
    if(target) {
      return target
    }
    target = this.nearestHostalSpawn(pos);
    if(target) {
      return target
    }
    target = this.nearestHostalStructure(pos);
    if (target) {
      return target
    }
    target = this.nearestStructure(pos);
    if (target) {
      return target
    }
  },

  nearByStructures: function(pos) {
    console.log('t')
    var structures = pos.findInRange(FIND_STRUCTURES, 1, {filter: {
      function(object) {
        return !_.includes(Memory.ignores, object.id)
      }
    }})
    console.log(structures)
    if (_.size(structures)) {
      return structures[0]
    }
  },

  findFullMiner: function(pos, room) {
    var creeps = _.filter(Game.creeps, function(creep) {
      return creep.my && creep.memory.mode === 'send' && creep.room.name === room.name
    })
    var miner = pos.findClosestByRange(creeps)
    if (miner) {
      miner.setMode('broadcast')
    }
    return miner
  },

  findEnergyBuffer: function(pos, room) {
    var objects = []
    _.union({}, room.memory.my_containers, room.memory.my_storages).forEach(function(value) {
      objects.push(Game.getObjectById(value.id));
    })
    var buffer = pos.findClosestByRange(objects, {filter: function(object) {
      var structure = Game.getObjectById(object.id)
      return structure.storedEnergy() >= 300;
    }});
    return buffer;
  },

  findEnergySource: function(pos, room) {
    var miner = Targeting.findFullMiner(pos, room)
    if (miner) {
      return miner
    } else {
      return Targeting.findEnergyBuffer(pos, room)
    }

  }

}
module.exports = Targeting;
