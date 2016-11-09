/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-11-01 04:28:00
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-08 20:44:29
*/

'use strict';

let DumbRoom = function() {}
//_.merge(CarrierCreep.prototype, EnergyHaulingCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype, LocalCreep.prototype);

/* the point of a dumb room is to keep roles simple. There should only be one
 * work role for example. The room then decides where to put that work creep.
 * This is a more monolithic approach then the the Legacy method. More
 * importantly it's considered dumb because it depends on errors to progress a
 * unit.
 */
DumbRoom.prototype.tickRoom = function() {
  // First check if every source is being mined. If it not then we need a worker
  Log.info("ticking Dumb room")
  let sources = Finder.findSources(this.name)
  let room = this
  sources.forEach(function(source){
    let count = _.size(_.filter(Game.creeps, creep => creep.hasTarget() && creep.target().id === source.id))
    let idles = _.filter(Game.creeps, creep=> !creep.hasTarget() && creep.hasRoom())
    if(count < Finder.findSourcePositionCountEach(room.name, source)) {
      if (_.size(idles) > 0) {
        idles[0].setTarget(source)
      } else {
        let role = DUMBROLES.getRole(room.energyCapacityAvailable, 'worker')
        Log.info('Spawn a worker')
        Log.info(JSON.stringify(role))
        room.spawn(role.body, role.role, source.id)
      }
    }
  })
  this.workCreeps()
}

DumbRoom.prototype.spawn = function(body, role, target) {
  let spawner = Finder.findSpawn(this.name)
  body = BodyBuilder.buildBody(body, this.energyCapacityAvailable, false, false, true)
  spawner.createCreep(body, null, {role: role, target: target})
}

DumbRoom.prototype.workCreeps = function() {
  let me = this;
  _.filter(Game.creeps).forEach(function(creep) {
    if(creep.my && creep.room.name === me.name) {
      if(creep.hasTarget()) {
        if(creep.target().isSource) {
          if(creep.harvest(creep.target()) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.target())
          }
          if(creep.isFull()) {
            delete creep.memory.target
          }
        } else if (creep.target().structureType == STRUCTURE_SPAWN) {
          if(creep.transfer(creep.target(), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.target())
          } else {
            delete creep.memory.target
          }
        } else if (creep.target().structureType == STRUCTURE_CONTROLLER) {
          if(creep.upgradeController(creep.target()) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.target())
          }
          if(creep.isEmpty()) delete creep.memory.target
        } else if (creep.target().progress || creep.target().progress === 0) { // construction site
          if(creep.build(creep.target()) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.target())
          }
          if(creep.isEmpty()) delete creep.memory.target
        } else if(creep.target().structureType === STRUCTURE_EXTENSION) {
          if(creep.transfer(creep.target(), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.target())
          } else {
            delete creep.memory.target
          }
        }
      } else { // no targets
        let spawner = Finder.findSpawn(me.name)
        if(spawner.hasRoom() && creep.hasSome()) {
          creep.setTarget(spawner)
        } else if(creep.hasSome() && Targeting.findClosestConstruction(creep.pos)) {
          creep.setTarget(Targeting.findClosestConstruction(creep.pos))
        } else if(creep.hasSome() && Targeting.getTransferTarget(creep.pos, me)) {
          creep.setTarget(Targeting.getTransferTarget(creep.pos, me))
        } else if(creep.hasSome()){
          creep.setTarget(me.controller)
        }
      }
    }
  })
}
