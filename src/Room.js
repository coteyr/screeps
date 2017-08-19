/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-29 19:24:01
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-15 04:14:04
*/

'use strict';

Room.prototype.tick = function() {
  global[this.name] = this; // makes it easy
  Storage.write("moveOne" + this.name, true)
}
/*Room.prototype.buildOut = function() {
  RoomBuilder.buildPlan(this.name)
  //if(this.needWalls()) Log.error('I need Walls')
  switch(Game.time % 10) {
    case 1:
      if(this.needExtensions()) this.addExtension()
      break
    case 2:
      if(this.needWalls()) this.addWalls()
      break
    case 3:
      if(this.needRamps()) this.addRamps()
      break
    case 4:
      if(this.needTowers()) this.addTowers()
      break
    case 5:
      if(this.needStorage()) this.addStorage()
      break
    case 6:
      if(this.needExtractor()) this.addExtractor()
      break
    case 7:
      if(this.needTerminal()) this.addTerminal()
      break
    case 8:
      if(this.needLab()) this.addLab()
      break
  }
}*/
Room.prototype.assignTask = function(task) {
  let creep = _.first(Finder.findIdleCreeps(this.name))
  if(creep) creep.setTask(task)
}
/*Room.prototype.assignCreeps = function() {
    if(this.needMiners()) this.assignTask('mine')
    if(this.needHaulers()) this.assignTask('haul')
    //if(_.isUndefined(this.memory.attack)) {
    if(this.needBuilders()) this.assignTask("build")
    if(this.needUpgraders()) this.assignTask("upgrade")

    if(this.needRepairers()) this.assignTask("repair")
    //}
}*/
Room.prototype.tickChildren = function() {
  _.each(Finder.findCreeps(this.name), c => { c.tick() })
  _.each(Finder.findMyTowers(this.name), t => { t.tick() })
  _.each(Finder.findSpawns(this.name), s => { s.tick() })
  if(this.controller) this.controller.tick()
}
Room.prototype.spawnCreep = function() {
  Log.info('Spawning a Creep')
  let spawn = Finder.findIdleSpawn(this.name)
  if(spawn) {
    spawn.spawn()
  }
}

Room.prototype.needDumpers = function() {
  if(!this.memory.dump) return false
  if(Finder.findCreepsWithTask(this.name, 'attacker').length <= 8) return true
  return false
}
Room.prototype.needAttackers = function() {
  if(!this.memory.attack) return false
  if(Finder.findCreepsWithTask(this.name, 'attacker').length <= 4) return true
  return false
}
Room.prototype.needDancers = function() {
  if(!this.memory.attack) return false
  if(Finder.findCreepsWithTask(this.name, 'dancer').length <= 4) return true
  return false
}
Room.prototype.needSwarmers = function() {
  if(!this.memory.attack) return false
  return true
}
Room.prototype.needBait = function() {
  if(!this.memory.attack) return false
  if(Finder.findCreepsWithTask(this.name, 'bait').length <= 4) return true
  return false
}
Room.prototype.needGuard = function() {
  if(!this.memory.attack) return false
  if(Finder.findCreepsWithTask(this.name, 'guard').length <= 12) return true
  return false
}
Room.prototype.needMedic = function() {
  if(!this.memory.attack) return false
  if(Finder.findCreepsWithTask(this.name, 'medic').length <= 0) return true
  return false
}
Room.prototype.needRecovery = function() {
  let creeps = Finder.findCreeps(this.name)
  if(creeps.length < 4) return true
  return(Finder.findCreepsWithTask(this.name, 'miner').length <= 0 && Finder.findCreepsWithTask(this.name, 'recovery') <= 2)
}
Room.prototype.needHaulers = function() {
  if(Finder.findCreepsWithTask(this.name, 'miner').length <= 0) return false
  let creeps = Finder.findCreepsWithTask(this.name, 'hauler')
  return creeps.length < Finder.findSources(this.name).length
}
Room.prototype.needMiners = function() {
  let sources = Finder.findSources(this.name).length
  let creeps = Finder.findCreepsWithTask(this.name, 'miner')
  let works = 0
  _.each(creeps, c => { works += c.partCount(WORK) })
  return (works < sources * 5) && (creeps.length < 4)
}
Room.prototype.needUpgraders = function() {
  let creeps = Finder.findCreepsWithTask(this.name, 'upgrader')
  if(creeps.length < Config.upgraders[this.rcl()]) {
    return true
  } else if(creeps.length < Config.upgraders[this.rcl()] * 2 && !this.needBuilders()) {
    return true
  }
  return false
}
Room.prototype.needBuilders = function() {
  if(Finder.findConstructionSites(this.name).length <= 0) return false
  let creeps = Finder.findCreepsWithTask(this.name, 'builder')
  return creeps.length < Config.builders[this.rcl()]
}
Room.prototype.needClaimer = function() {
  if(Finder.findCreepsWithTask(this.name, 'claimer').length >= 1) return false
  if(this.memory.claim) return true
  return false
}
Room.prototype.needRemoteBuilders = function() {
  if(!this.memory.build) return false
  if(Finder.findCreepsWithTask(this.name, 'remote-builder').length <= 2) return true
  return false
}
Room.prototype.isFull = function() {
  return this.energyAvailable >= this.energyCapacityAvailable
}
Room.prototype.dump = function(roomName) {
  this.memory.dump = roomName
}
Room.prototype.build = function(roomName) {
  this.memory.build = roomName
}
Room.prototype.claim = function(roomName) {
  this.memory.claim = roomName
}
Room.prototype.attack = function(roomName) {
  this.memory.attack = roomName
}
Room.prototype.tactic = function(tactic) {
  this.memory.tactic = tactic
}
Room.prototype.spawnAttackCreep = function() {
  Log.warn('Spawning attack Creep')
  let tactic = this.memory.tactic
  if(tactic) {
    let spawn = Finder.findIdleSpawn(this.name)
    if(spawn) {
      spawn.spawnAttack(tactic, this.memory.attack)
    }
  }
}
Room.prototype.spawnClaimCreep = function() {
  let spawn = Finder.findIdleSpawn(this.name)
  if(spawn) {
    if(spawn.spawnClaim(this.memory.claim)) {
      delete this.memory.claim
    }
  }
}
Room.prototype.spawnRemoteBuildCreep = function() {
  let spawn = Finder.findIdleSpawn(this.name)
  if(spawn) {
    spawn.spawnRemoteBuild(this.memory.build)
  }
}
Room.prototype.attackingCreepMoves = function(attackingCreeps) {
  if(!CpuConservation.haveCpu()) return false
  _.each(attackingCreeps, c => {
    if(Game.rooms[c.memory.home].memory.tactic === 'deny') {
      DenyTactic.doAttack(c, this)
    } else {
      NormalTactic.doAttack(c, this)
    }
  })
}
Room.prototype.homeCreepMoves = function(homeCreeps) {
  if(!CpuConservation.haveCpu()) return false
  let flag = Finder.findFlagByColor(this.name, COLOR_RED, COLOR_RED)
  let opts = {
    reusePath: 5,
    visualizePathStyle: {opacity: 0.75, stroke: Config.colors.red},
    ignoreCreeps: true,
    reusePath: 20
  }
  _.each(homeCreeps, c => {
    if(homeCreeps.length < Config.bodies[this.memory.tactic]['size'] && this.memory.attack) {
      c.moveTo(flag.pos)
    } else {

      if(Config.bodies[this.memory.tactic]['size'] > 0) delete this.memory.attack
      let route = Game.map.findRoute(c.room, c.memory.targetRoom, {routeCallback(roomName, fromRoomName) {
          /*if(roomName == 'W7S87') {  // avoid this room
            return Infinity;
          }*/
          return 1;
      }})
      let exit = c.pos.findClosestByRange(route[0].exit);
      c.moveTo(exit, opts);
    }
  })
}
Room.prototype.travelCreepMoves = function(travelCreeps) {
  if(!CpuConservation.haveCpu()) return false
  let says = ['Lead', 'us', 'for', 'the', 'swarm']
  let opts = {reusePath: 5,
    visualizePathStyle: {opacity: 0.75, stroke: Config.colors.red},
    ignoreCreeps: true,
    reusePath: 20
  }
  _.each(travelCreeps, c => {

    c.say(says[Game.time % 5], true)
      let route = Game.map.findRoute(c.room, c.memory.targetRoom, {routeCallback(roomName, fromRoomName) {
          /*if(roomName == 'W7S87') {  // avoid this room
            return Infinity;
          }*/
          return 1;
      }})
      let exit = c.pos.findClosestByRange(route[0].exit);
      c.moveTo(exit, opts);
  })
}
Room.prototype.attackMoves = function() {
  if(!CpuConservation.haveCpu()) return false
  let creeps = Finder.findAttackCreeps(this.name)
  let homeCreeps = _.filter(creeps, c => { return c.memory.home === this.name && c.room.name === this.name})
  let travelCreeps = _.filter(creeps, c => { return this.name == c.room.name && c.memory.home !== this.name && c.memory.targetRoom !== this.name})
  let attackingCreeps = _.filter(creeps, c => { return this.name === c.room.name && this.name === c.memory.targetRoom})
  this.attackingCreepMoves(attackingCreeps)
  this.travelCreepMoves(travelCreeps)
  this.homeCreepMoves(homeCreeps)

}
Room.prototype.isMine = function() {
  return this.controller &&  this.controller.my
}
Room.prototype.rcl = function() {
  if(this.isMine()) return this.controller.level
}
