/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-06-28 21:58:44
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-08 10:51:59
*/

'use strict';
class Kernel {
  constructor() {
    this.time = new Time()
    this.hud = new Hud()
    this.cpu = new Cpu()
    this.config = new Configurator()
    this.entities = []
  }
  tick() {
    Log.info(["Starting Tick", this.time.gameTime])
    this.cleanCreepsMemory()
    this.processEntites()
    this.hud.addLine("CPU", this.cpu.usedCpu(), this.cpu.limit(), null)
    this.hud.addLine("Entities", 0, this.entities.length)
    if(this.config.getValue('showHud', Config.showHud) === true) this.hud.display()
    Log.info(["Ending Tick", this.time.gameTime])
  }
  cleanCreepsMemory() {
    for(var i in Memory.creeps) {
      if(!Game.creeps[i]) {
        delete Memory.creeps[i];
      }
    }
  }
  register(target, state = 'unknown') {
    let entity = {
      room: target.room,
      state: state,
      type: target.type,
      name: target.name,
      id: target.id,
      processed: false,
      thing: target
    }
    this.entities.push(entity)
  }
  processEntites() {
    this.processSpawns()
    this.processRecovery()
    this.processMiners()
    this.processHaulers()
    this.processBuilders()
    this.processUpgraders()
    this.processTowers()
    this.processAttackers()
    this.processClaimers()
    this.processRemoteBuilders()
  }
  processSpawns() {
    let spawns = _.filter(this.entities, e => { return !e.processed && e.state === 'idle' && e.type === STRUCTURE_SPAWN })
    _.each(spawns, s => {
      if(s.room.needRecovery()) {
        s.thing.spawnACreep('recovery')
      } else if(s.room.needHaulers()) {
        s.thing.spawnACreep('hauler')
      } else if(s.room.needMiners()) {
        s.thing.spawnACreep('miner')
      } else if(s.room.needBuilders()) {
        s.thing.spawnACreep('builder')
      } else if(s.room.needUpgraders()) {
        s.thing.spawnACreep('upgrader')
      } else if(s.room.needAttackers()) {
        s.thing.spawnARemoteCreep('attacker', s.room.memory.attack)
      } else if(s.room.needClaimer()) {
        s.thing.spawnAClaimCreep();
      } else if(s.room.needRemoteBuilders()) {
        s.thing.spawnARemoteCreep('remote-builder', s.room.memory.build)
      }
    })
  }
  processRecovery() {
    let creeps = _.filter(this.entities, e => { return !e.processed && e.type === 'creep' && e.thing.memory.task === 'recovery' })
    _.each(creeps, c => {
      _.merge(Creep.prototype, RecoveryCreep.prototype)
      c.thing.recover()
    })
  }
  processMiners() {
    let creeps = _.filter(this.entities, e => {return !e.processed && e.type === 'creep' && e.thing.memory.task === 'miner'})
    _.each(creeps, c =>{
      _.merge(Creep.prototype, MinerCreep.prototype)
      c.thing.mine()
    })
  }
  processHaulers() {
    let creeps = _.filter(this.entities, e => {return !e.processed && e.type === 'creep' && e.thing.memory.task === 'hauler'})
    _.each(creeps, c =>{
      _.merge(Creep.prototype, HaulerCreep.prototype)
      c.thing.haul()
    })
  }
  processUpgraders() {
    let creeps = _.filter(this.entities, e => {return !e.processed && e.type === 'creep' && e.thing.memory.task === 'upgrader'})
    _.each(creeps, c =>{
      _.merge(Creep.prototype, UpgraderCreep.prototype)
      c.thing.upgrade()
    })
  }
  processBuilders() {
    let creeps = _.filter(this.entities, e => {return !e.processed && e.type === 'creep' && e.thing.memory.task === 'builder'})
    _.each(creeps, c =>{
      _.merge(Creep.prototype, BuilderCreep.prototype)
      c.thing.builder()
    })
  }
  processClaimers() {
    let creeps = _.filter(this.entities, e => {return !e.processed && e.type === 'creep' && e.thing.memory.task === 'claimer'})
    _.each(creeps, c =>{
      _.merge(Creep.prototype, ClaimerCreep.prototype)
      c.thing.claimer()
    })
  }
  processRemoteBuilders() {
    let creeps = _.filter(this.entities, e => {return !e.processed && e.type === 'creep' && e.thing.memory.task === 'remote-builder'})
    _.each(creeps, c =>{
      _.merge(Creep.prototype, RemoteBuilderCreep.prototype)
      c.thing.remoteBuilder()
    })
  }
  processAttackers() {
    let creeps = _.filter(this.entities, e => {return !e.processed && e.type === 'creep' && e.thing.memory.task === 'attacker'})
    _.each(creeps, c =>{
      _.merge(Creep.prototype, AttackCreep.prototype)
      c.thing.attacker()
    })
  }
  processTowers() {
    _.each(Game.rooms, r=> {
      _.each(Finder.findMyTowers(r.name), t => { t.tower() })
    })
  }
}
