/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-14 18:56:20
*/

'use strict';

StructureSpawn.prototype.getExoClaimerBody = function(){
  var energy = this.room.energyCapacity();
  if (energy >= 1300 && energy < 1800) {
    return [CLAIM, CLAIM, MOVE, MOVE]
  } else if (energy >= 1800) {
    return [CLAIM, CLAIM, MOVE, MOVE]

  } else {
    return []
  }
}
StructureSpawn.prototype.exoClaimers = function() {
  return Finder.findAllCreepCount('exo-claimer', this) // needs to be in all rooms
}

StructureSpawn.prototype.maxExoClaimers = function() {
  return this.memory.max_exo_claimers || 0
}

StructureSpawn.prototype.setMaxExoClaimers = function() {
  if(this.room.exoOperations() && this.room.memory.claim) {
    this.memory.max_exo_claimers = _.size(this.room.memory.claim);
  } else {
    this.memory.max_exo_claimers = 0;
  }
}

StructureSpawn.prototype.setExoClaimers = function() {
  this.memory.current_exo_claimers = Finder.findCreeps('exo-claimer', this.room.name).length
}

StructureSpawn.prototype.spawnExoClaimer = function() {
  /*var choice = Memory.last_claim_choice || 0;
  this.createCreep(this.getExoClaimerBody(), null, {role: 'exo-claimer', mode: 'idle', home: this.room.roomName, claim: Memory.claim[choice] })
  choice += 1
  if (choice > _.size(Memory.claim) - 1) {
    choice = 0
  }
  Memory.last_claim_choice = choice*/
  this.addToSpawnQueue('exo-claimer', this.getExoClaimerBody(), 10)
}
