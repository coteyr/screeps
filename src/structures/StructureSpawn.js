/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-02 22:42:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-05-23 22:17:34
*/

'use strict';

StructureSpawn.prototype.tick = function() {
  if(this.spawning) return true
  _.each(Finder.findCreepsNearSpawn(this), c => {
    if(c.ticksToLive < 1450 && c.body.length > 3) this.renewCreep(c)
  })
}
StructureSpawn.prototype.canSpawn = function(body) {
  return this.canCreateCreep(body) === OK
}
StructureSpawn.prototype.cleanCreepsMemory = function() {
  for(var i in Memory.creeps) {
    if(!Game.creeps[i]) {
        delete Memory.creeps[i];
    }
  }
}
StructureSpawn.prototype.startSpawn = function(body, targetRoom, task) {
  this.cleanCreepsMemory()
  let id = Counter.number()
  Log.debug(['Spawning Creep at', this.name])
  if(this.canSpawn(body)) {
    Log.error('2')
    Error.worked(this.createCreep(body, id, {task: task, home: this.room.name, targetRoom: targetRoom}))
    return true
  } else {
    Log.error(['Cant build', task, 'creep.', body], this.room.name)
  }
  return false
}
StructureSpawn.prototype.spawn = function() {
  let body = Config.bodies[this.room.energyCapacityAvailable]
  let task = "idle"
  if(Finder.findCreeps(this.room.name).length < 4 || Finder.findCreepsWithTask(this.room.name, 'haul').length < 2)
  {
    body = Config.bodies.default
    task = "haul"
  }
  //if(Finder.findCreeps(this.room.name).length < 4) body = Config.bodies.default
  if(_.isNull(body)) {
    body = Config.bodies.default
    if(this.room.energyCapacityAvailable >= 1800) body = Config.bodies[1800]
    Log.warn(["Having to use default body, Config.bodies is missing an entry for", this.room.energyCapacityAvailable])
  }
  return this.startSpawn(body, this.room.name, task)
}
StructureSpawn.prototype.spawnClaim = function(roomName) {
  let body = Config.bodies['claim']
  return this.startSpawn(body, roomName, 'claim')
}

StructureSpawn.prototype.spawnRemoteBuild = function(roomName) {
  let body = Config.bodies[this.room.energyCapacityAvailable]
  return this.startSpawn(body, roomName, 'remote_build')
  return true
}
StructureSpawn.prototype.spawnAttack = function(tactic, roomName) {
  let body = Config.bodies[tactic]['body']
  return this.startSpawn(body, roomName, 'attack')
}
StructureSpawn.prototype.hasRoom = function() {
  return this.energy < this.energyCapacity
}
StructureSpawn.prototype.isFull = function() {
  return !this.hasRoom()
}
