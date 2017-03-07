/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-06 22:44:08
*/

'use strict';

let RemoteBuildCreep = function() {}
RemoteBuildCreep.prototype.superTick = function() {
  if(this.room.name === this.memory.home && this.isEmpty()) {
    if(this.withdraw(this.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
     this.moveTo(this.room.storage);
    }
  } else if(this.room.name !== this.memory.targetRoom) {
    let pos = new RoomPosition(25, 25, this.memory.targetRoom)
    this.moveTo(pos)
  } else {
    if(this.isEmpty() || this.memory.collect) {
      this.memory.collect = true
      if(this.needsTarget()) this.setTarget(Targeting.findOpenSourceSpot(this.room.name))
      this.harvest(this.target())

    }
    if(this.isFull() || _.isUndefined(this.memory.collect)) {
      delete this.memory.collect
      let target = Finder.findSpawnConstruction(this.room.name)
      if(target) {
        this.build(target)
      }
    }
  }
  if(this.room.name == this.memory.targetRoom && Finder.findSpawns(this.room.name).length > 0) {
    this.setTask('idle')
    delete Game.rooms[this.memory.home].memory.build
  }
}
