/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-18 00:59:13
*/

'use strict';

StructureSpawn.prototype.getUpgraderBody = function(){
  var energy = this.room.energyCapacity();
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
}
