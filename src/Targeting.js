/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-03 11:36:42
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-04 00:13:30
*/

'use strict';

var Targeting = {
  getTransferTarget: function(pos, room) {
    var result;
    var biggest = 0;
    var objects = _.union({}, room.myCreeps(), room.memory.my_spawns, room.memory.my_extensions, room.memory.my_towers, room.memory.my_storages)
    // This may be doable with _.maxBy()
    Object.keys(objects).forEach(function(key, index) {
      var target = Game.getObjectById(objects[key].id);
      if(target.memory) {
        if (target.memory.call_for_energy) {
          if (target.memory.call_for_energy >= biggest) {
            result = target;
            biggest = target.memory.call_for_energy
          }
        } else {
          // target.memory.call_for_energy = 0
          //result = target
           //biggest = 0;
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

  findEnergyBuffer: function(pos, room, mode) {
    if(!mode) {
      mode = 'none'
    }
    var objects = []
    if (mode === 'carrier') {
    _.union({}, room.memory.my_containers).forEach(function(value) {
      objects.push(Game.getObjectById(value.id));
    })
    } else {
      _.union({}, room.memory.my_containers, room.memory.my_storages).forEach(function(value) {
        objects.push(Game.getObjectById(value.id));
      })
    }
    var buffer = pos.findClosestByRange(objects, {filter: function(object) {
      var structure = Game.getObjectById(object.id)
      // if (mode === 'pickup') {
      //  return structure.structureType !== 'storage' && structure.storedEnergy() >= 300
      //} else {
        return structure.storedEnergy() >= 300;
      //}
    }});
    if(buffer) {
      return buffer;
    } else {
      objects = []
      _.union({}, room.memory.my_storages).forEach(function(value) {
        objects.push(Game.getObjectById(value.id));
      })
      buffer = pos.findClosestByRange(objects, {filter: function(object) {
      var structure = Game.getObjectById(object.id)
      // if (mode === 'pickup') {
      //  return structure.structureType !== 'storage' && structure.storedEnergy() >= 300
      //} else {
        return structure.storedEnergy() >= 300;
      //}
    }});
    }
    return buffer

  },

  findEnergySource: function(pos, room, mode) {
    if(!mode) {
      mode = 'grab'
    }
    var miner = Targeting.findFullMiner(pos, room)
    if (miner) {
      return miner
    } else {
      return Targeting.findEnergyBuffer(pos, room, mode)
    }

  },

  findCloseContainer: function(pos, range) {
    var results = pos.findInRange(FIND_STRUCTURES, range, {filter: {structureType: STRUCTURE_CONTAINER}})
    if(_.size(results) > 0) return results[0]
  },

  findClosestConstruction: function(pos){
    return pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
  },

  findClosestRepairTarget: function(pos, room){
    var locations = room.find(FIND_STRUCTURES, {filter: function(structure) {
      if(_.includes(room.demos, structure.id)) return false
        return structure.hits < structure.hitsMax * 0.75 && structure.structureType !== 'constructedWall'
      }})
    pos.findClosestByRange(locations);
  },

  findCloseExtension: function(pos, range){
    if(!range) range = 1
    var canidates = pos.findInRange(FIND_STRUCTURES, range, {filter: function(e){
      return e.structureType === STRUCTURE_EXTENSION && e.hasRoom()
    }})
    if(_.size(canidates) > 0) return canidates[0]
  }



}
module.exports = Targeting;
