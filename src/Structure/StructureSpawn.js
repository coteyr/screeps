/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 02:57:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-12 11:36:25
*/

'use strict';

StructureSpawn.prototype.spawnACreep = function(task, body) {
  if(this.spawnCreep(body, 'test', {dryRun: true}) === OK) {
    let id = Counter.number()
    this.spawnCreep(body, id, {memory: {task: task, home: this.room.name, created: Game.tick}})
  } else {
    Log.error(["Can't build", task, 'creep:', this.room.energyAvailable, "of", this.room.energyCapacityAvailable], this.room.name)
  }
}
StructureSpawn.prototype.isFull = function() {
  return this.energyCapacity == this.energy
}
