/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-15 16:33:03
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-27 19:04:47
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
      return [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    } else if(energy >= 800 && energy < 1300) {
      return [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    } else if(energy >= 1300 && energy < 1800) {
      return [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE] //10 Energy Tick
    } else if(energy >= 1800) {
      return [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE] // 10 Energy Tick
    } else {
      return [WORK, CARRY, MOVE]
    }
   } },
  { role: 'carrier',   multiplyer: function(spawn){
     if (spawn.room.carrierReady()) {
        return spawn.room.sourceCount() * 1;
     } else {
      return 0;
     }
    }, priority: 3, body: function(spawn){
      var energy = spawn.room.energyCapacity();
      if (energy >= 300 && energy < 550) {
        return [CARRY, CARRY, MOVE, MOVE]
      } else if(energy >= 550 && energy < 800) {
        return [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
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
      return spawn.room.sourceCount() * 4;
     }
  }, priority: 1, body: function(spawn){
    var energy = spawn.room.energyCapacity();
    if (energy >= 300 && energy < 550) {
      return [WORK, CARRY, CARRY, MOVE, MOVE]
    } else if(energy >= 550 && energy < 800) {
      return [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
    } else if(energy >= 800 && energy < 1300) {
      return [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
    } else if(energy >= 1300) {
      return [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE] // 10 Energy Tick
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
     if(spawn.room.needsConstruction() && spawn.room.carrierReady()) {
      return 1
    } else if(!spawn.room.needsConstruction() && spawn.room.carrierReady()) {
      return 2
    } else {
      return 0;
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
  { role: 'exo-tank',      arrayName: 'attack',  multiplyer: 5,  priority: 10, body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, WORK, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] },
  { role: 'exo-attacker',  arrayName: 'attack',  multiplyer: 10, priority: 15, body: [TOUGH, TOUGH, ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE] },
  { role: 'exo-healer',    arrayName: 'attack',  multiplyer: 4,  priority: 11, body: [TOUGH, TOUGH, HEAL, MOVE, MOVE, MOVE, MOVE] },
  { role: 'exo-demo',      arrayName: 'attack',  multiplyer: 4,  priority: 12, body: [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE] },
  { role: 'exo-builder',   arrayName: 'build',   multiplyer: 4,  priority: 30, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] },
  { role: 'exo-harvester', arrayName: 'harvest', multiplyer: 2,  priority: 20, body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK] },
  { role: 'exo-claimer',   arrayName: 'claim',   multiplyer: 1,  priority: 1,  body: [CLAIM, CLAIM, MOVE, MOVE] },
  { role: 'exo-reserver',  arrayName: 'reserve', multiplyer: 1,  priority: 30, body: [CLAIM, CLAIM, MOVE, MOVE] },
  { role: 'exo-theif',     arrayName: 'steal',   multiplyer: 2,  priority: 20, body: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]},
  { role: 'exo-miner',     arrayName: 'mine',    multiplyer: 1,  priority: 20, body: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE] },
  { role: 'exo-carrier',   arrayName: 'carry',   multiplyer: 1,  priority: 20, body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] },
  { role: 'exo-responder', arrayName: 'responder', multiplyer: 2, priority: 5, body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL]}
]

module.exports = ROLES, EXOROLES;
