/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-02 22:42:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-27 18:34:47
*/

'use strict';

StructureSpawn.prototype.spawn = function() {
  let id = Counter.number()
  let body = Config.bodies[this.room.energyCapacityAvailable]
  if(Finder.findCreeps(this.room.name).length < 4 || Finder.findCreepsWithTask(this.room.name, 'haul').length < 1) body = Config.bodies.default
  if(_.isNull(body)) body = Config.bodies.default
  if (this.canCreateCreep(body, id) === OK) {
    Error.worked(this.createCreep(body, id, {task: 'idle'}))
    Log.info(['Spawning Creep at', this.name])
  }
}
StructureSpawn.prototype.spawnClaim = function(roomName) {
  let id = Counter.number()
  let body = Config.bodies['claim']
  if (this.canCreateCreep(body, id) === OK) {
    Error.worked(this.createCreep(body, id, {task: 'claim', targetRoom: roomName, home: this.room.name}))
    return true
  }
  return false
}
StructureSpawn.prototype.spawnRemoteBuild = function(roomName) {
  let id = Counter.number()
  let body = Config.bodies[this.room.energyCapacityAvailable]
  if (this.canCreateCreep(body, id) === OK) {
    Error.worked(this.createCreep(body, id, {task: 'remote_build', targetRoom: roomName, home: this.room.name}))
    return true
  }
  return false
}
StructureSpawn.prototype.spawnAttack = function(tactic, roomName) {
  let id = Counter.number()
  let body = Config.bodies[tactic]
  if (this.canCreateCreep(body, id) === OK) {
    Error.worked(this.createCreep(body, id, {task: 'attack', targetRoom: roomName, home: this.room.name}))
  }
}
StructureSpawn.prototype.hasRoom = function() {
  return this.energy < this.energyCapacity
}
StructureSpawn.prototype.isFull = function() {
  return !this.hasRoom()
}
