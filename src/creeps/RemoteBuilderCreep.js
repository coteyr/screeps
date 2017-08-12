/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-08 10:08:54
*/

'use strict';

let RemoteBuilderCreep = function() {}
/*RemoteBuilderCreep.prototype.superTick = function() {
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
        if(this.isEmpty()) {
          this.clearTarget()
          this.memory.collect == true
        }
      }
    }
  }
  if(this.room.name == this.memory.targetRoom && Finder.findSpawns(this.room.name).length > 0) {
    this.setTask('idle')
    delete Game.rooms[this.memory.home].memory.build
  }
}*/
RemoteBuilderCreep.prototype.remoteBuilder = function() {
  if(this.room.name === this.memory.targetRoom && this.pos.x > 1 && this.pos.y > 1) {
    // build stuff
    if(this.isEmpty()) {
      this.memory.status = 'fill'
    }
    if(this.isFull()) {
      this.memory.status = 'empty'
      this.clearTarget()
    }
    if(this.memory.status === 'fill') {
      if(this.hasTarget()) {
        this.harvest(this.target())
      } else {
        this.setTarget(Targeting.findOpenSourceSpot(this.room.name))
      }
    } else {
      this.buildThings()
    }
  } else {
    let pos = new RoomPosition(25, 25, this.memory.targetRoom)
    this.moveTo(pos)
  }
}

RemoteBuilderCreep.prototype.buildThings = function() {
  if(this.needsTarget('build')) this.setTarget(_.first(Finder.findConstructionSites(this.room.name)), 'build')
  if(this.hasTarget('build')) this.build(this.target('build'))
}



