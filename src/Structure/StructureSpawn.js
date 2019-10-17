/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 02:57:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-07-03 01:26:41
*/

'use strict';

StructureSpawn.prototype.cleanMemory = function() {
  for(var i in Memory.creeps) {
    if(!Game.creeps[i]) {
        delete Memory.creeps[i];
    }
  }
}
StructureSpawn.prototype.spawnACreep = function(task, body, dest = null, strat=null) {
  this.cleanMemory()
  if(!dest) dest = this.room.name
    let id = task + "-" + Counter.number()
  if(this.spawnCreep(body, id, {dryRun: true}) === OK) {
    this.spawnCreep(body, id, {memory: {task: task, home: this.room.name, created: Game.tick, dest: dest, strat: strat}})
  } else {
    Log.error(["Can't build", task, 'creep:', this.room.energyAvailable, "of", this.room.energyCapacityAvailable, ":", this.spawnCreep(body, id, {dryRun: true})], this.room.name)
  }
}
StructureSpawn.prototype.isFull = function() {
  return this.energyCapacity == this.energy
}
