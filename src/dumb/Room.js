/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-11-01 04:28:00
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-12 11:48:33
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
  let room = this
  room.eachSource()
  this.workCreeps()
  Log.tick()
}

DumbRoom.prototype.eachSource = function() {
  let room = this
  let sources = Finder.findSources(this.name)

  let idles = _.filter(Game.creeps, creep=> !creep.hasTarget() && creep.hasRoom())
  sources.forEach(function(source){
    let count = _.size(_.filter(Game.creeps, creep => creep.hasTarget() && creep.target().id === source.id))
    if(count < Finder.findSourcePositionCountEach(room.name, source)) {
      if (_.size(idles) > 0) {
        idles[0].setTarget(source)
      } else {
        room.spawnWorker(source)
      }
    }
  })
}

DumbRoom.prototype.spawnWorker = function(source) {
  let role = DUMBROLES.getRole(this.energyCapacityAvailable, 'worker')
  Log.info('Spawning a worker')
  this.spawn(role.body, role.role, source.id)
}

DumbRoom.prototype.spawn = function(body, role, target) {
  let spawner = Finder.findSpawn(this.name)
  body = BodyBuilder.buildBody(body, this.energyCapacityAvailable, false, false, true)
  spawner.createCreep(body, null, {role: role, target: target, home: this.name})
}

DumbRoom.prototype.pickTarget = function(creep) {
  let spawner = Finder.findSpawn(this.name)
  if(spawner.hasRoom() && creep.hasSome()) {
    creep.setTarget(spawner)
  } else if(creep.hasSome() && Targeting.getTransferTarget(creep.pos, this)) {
    creep.setTarget(Targeting.getTransferTarget(creep.pos, this))
  } else if(creep.hasSome() && Targeting.findClosestConstruction(creep.pos)) {
    creep.setTarget(Targeting.findClosestConstruction(creep.pos))
  } else if(creep.hasSome()){
    creep.setTarget(this.controller)
  }
}

DumbRoom.prototype.harvest = function(creep) {
  this.getCloseAndAction(creep, creep.harvest(creep.target())
  if(creep.isFull()) delete creep.memory.target
}

DumbRoom.prototype.transfer = function(creep) {
  if(this.getCloseAndAction(creep, creep.transfer(creep.target(), RESOURCE_ENERGY))) {
    creep.moveTo(creep.target())
  } else {
    delete creep.memory.target
  }
}

DumbRoom.prototype.upgradeRCL = function(creep) {
  this.getCloseAndAction(creep, creep.upgradeController(creep.target()))
  if(creep.isEmpty()) delete creep.memory.target
}

DumbRoom.prototype.build = function(creep) {
  this.getCloseAndAction(creep, creep.build(creep.target()))
  if(creep.isEmpty()) delete creep.memory.target
}

DumbRoom.prototype.getCloseAndAction = function(creep, action) {
  if(action === ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.target())
    return false
  } else {
    return true
  }
}





DumbRoom.prototype.workCreeps = function() {
  let me = this;
  _.filter(Game.creeps).forEach(function(creep) {
    if(creep.needsTarget()) me.pickTarget(creep)
    if(creep.needsTarget()) return false // still no targets so idle
    if(creep.target().isSource) {
      me.harvest(creep)
    } else if (creep.target().structureType == STRUCTURE_SPAWN) {
      me.transfer(creep)
    } else if (creep.target().structureType == STRUCTURE_CONTROLLER) {
      me.upgradeRCL(creep)
    } else if (creep.target().progress || creep.target().progress === 0) { // construction site
      me.build(creep)
    } else if (creep.target().structureType === STRUCTURE_EXTENSION) {
      me.transfer(creep)
    }
  })
}
