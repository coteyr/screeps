/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-15 16:33:03
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-18 02:14:14
*/

'use strict';

var ROLES = [
  { role: 'builder',   multiplyer: function(spawn){
    if(spawn.room.needsConstruction()) {
      return 2
    } else {
      return 1
    }
   }, priority: 4, body: function(spawn){
    var energy = spawn.room.energyCapacity();
    if (energy >= 300 && energy < 550) {
      return [WORK, CARRY, MOVE]
    } else if(energy >= 550 && energy < 800) {
      return [WORK, WORK, MOVE, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    } else if(energy >= 800 && energy < 1300) {
      return [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    } else if(energy >= 1300 && energy < 1800) {
      return [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE] //10 Energy Tick
    } else if(energy >= 1800) {
      return [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE] // 10 Energy Tick
    } else {
      return [WORK, CARRY, MOVE]
    }
   } },
  { role: 'carrier',   multiplyer: function(spawn){
     if (spawn.room.carrierReady()) {
      return spawn.room.sourceCount() * 2;
     } else {
      return 0;
     }
    }, priority: 3, body: function(spawn){
      var energy = spawn.room.energyCapacity();
      if (energy >= 300 && energy < 550) {
        return [CARRY, CARRY, MOVE, MOVE]
      } else if(energy >= 550 && energy < 800) {
        return [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
      } else if(energy >= 800 && energy < 1300) {
        return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
      } else if(energy >= 1300 && energy < 1800) {
        return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
      } else if(energy >= 1800) {
        return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
      } else {
        return [WORK, CARRY, MOVE]
      }
     } },
  { role: 'harvester', multiplyer: function(spawn){
    if (spawn.room.carrierReady()) {
      return 0;
     } else {
      return spawn.room.sourceCount() * 2;
     }
  }, priority: 1, body: function(spawn){
    var energy = spawn.room.energyCapacity();
    if (energy >= 300 && energy < 550) {
      return [WORK, CARRY, CARRY, MOVE, MOVE]
    } else if(energy >= 550 && energy < 800) {
      return [WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY]
    } else if(energy >= 800 && energy < 1300) {
      return [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
    } else if(energy >= 1300) {
      return [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] // 10 Energy Tick
    } else {
      return [WORK, CARRY, MOVE]
    }
  } },
  { role: 'miner',     multiplyer: function(spawn){
    if (spawn.room.carrierReady()) {
      return spawn.room.sourceCount();
     } else {
      return 0;
     }
  }, priority: 2, body: function(spawn){
    var energy = spawn.room.energyCapacity();
    if (energy >= 300 && energy < 550) {
      return [WORK, WORK, CARRY, MOVE] // 4 Energy Tick
    } else if(energy >= 550 && energy < 800) {
      return [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE]
    } else if(energy >= 800 && energy < 1300) {
      return [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE]
    } else if(energy >= 1300 && energy < 1800) {
      return [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE] // 10 Energy Tick
    } else if(energy >= 1800) {
      return [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE] // 10 Energy Tick
    } else {
      return [WORK, CARRY, MOVE]
    }
   } },
  { role: 'upgrader',  multiplyer: function(spawn){
     if(spawn.room.needsConstruction()) {
      return 1
    } else {
      return 2
    }
  }, priority: 4, body: function(spawn){
    var energy = spawn.room.energyCapacity();
    if (energy >= 300 && energy < 550) {
      return [WORK, CARRY, MOVE]
    } else if(energy >= 550 && energy < 800) {
      return [WORK, WORK, WORK, MOVE, CARRY, CARRY, CARRY, CARRY]
    } else if(energy >= 800 && energy < 1300) {
      return [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE]
    } else if(energy >= 1300 && energy < 1800) {
      return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE]
    } else if(energy >= 1800) {
      return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE] // 10 Energy Tick
    } else {
      return [WORK, CARRY, MOVE]
    }
   } }

]

var EXOROLES = [
  { role: 'exo-attacker',  arrayName: 'attack',  multiplyer: 10, priority: 10, body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE] },
  { role: 'exo-builder',   arrayName: 'build',   multiplyer: 1,  priority: 30, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] },
  { role: 'exo-harvester', arrayName: 'harvest', multiplyer: 4,  priority: 20, body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] },
  { role: 'exo-claimer',   arrayName: 'claim',   multiplyer: 1,  priority: 10, body: [CLAIM, CLAIM, MOVE, MOVE] },
  { role: 'exo-reserver',  arrayName: 'reserve', multiplyer: 1,  priority: 10, body: [CLAIM, CLAIM, MOVE, MOVE] },
  { role: 'exo-theif',     arrayName: 'steal',   multiplyer: 2,  priority: 20, body: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]}
]

module.exports = ROLES, EXOROLES;
