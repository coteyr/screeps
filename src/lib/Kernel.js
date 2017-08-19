/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-06-28 21:58:44
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-19 05:32:00
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
    //try {
    Log.info(["Starting Tick", this.time.gameTime])
    this.cleanCreepsMemory()
    this.processEntites()
    this.hud.addLine("CPU", this.cpu.usedCpu(), this.cpu.limit(), null)
    this.hud.addLine("Entities", 0, this.entities.length)
    if(this.config.getValue('showHud', Config.showHud) === true) this.hud.display()
    Log.info(["Ending Tick", this.time.gameTime])
    //} catch (e){
      //log error
    //}
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
    this.processCreeps('recovery', RecoveryCreep, 'recover')
    this.processCreeps('miner', MinerCreep, 'mine')
    this.processCreeps('hauler', HaulerCreep, 'haul')
    this.processCreeps('builder', BuilderCreep, 'builder')
    this.processCreeps('upgrader', UpgraderCreep, 'upgrade')
    this.processTowers()
    this.processCreeps('attacker', AttackCreep, 'attacker')
    this.processCreeps('dancer', DancerCreep, 'dancer')
    this.processCreeps('guard', GaurdCreep,'gaurd')
    this.processBaitSquad()
    this.processCreeps('swarmer', AttackCreep, 'attacker')
    this.processCreeps('claimer', ClaimerCreep, 'claimer')
    this.processCreeps('remote-builder', RemoteBuilderCreep, 'remoteBuilder')
    this.processCreeps('dumper', DumperCreep, 'dumper')
    this.clearSpots()
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
      } else if(s.room.memory.tactic === "attack" && s.room.needAttackers()) {
        s.thing.spawnARemoteCreep('attacker', s.room.memory.attack)
      } else if(s.room.memory.tactic === "bait" && s.room.needBait()) {
        s.thing.spawnARemoteCreep('bait', s.room.memory.attack)
      } else if(s.room.memory.tactic === 'bait' && s.room.needMedic()) {
        s.thing.spawnARemoteCreep('medic', s.room.memory.attack)
      } else if(s.room.memory.tactic === 'swarm' && s.room.needSwarmers()) {
        s.thing.spawnARemoteCreep('swarmer', s.room.memory.attack)
      } else if(s.room.memory.tactic === 'dance' && s.room.needDancers()) {
        s.thing.spawnARemoteCreep('dancer', s.room.memory.attack)
      } else if(s.room.memory.tactic === 'guard' && s.room.needGuard()) {
        s.thing.spawnARemoteCreep('guard', s.room.memory.attack)
      } else if(s.room.needClaimer()) {
        s.thing.spawnAClaimCreep();
      } else if(s.room.needRemoteBuilders()) {
        s.thing.spawnARemoteCreep('remote-builder', s.room.memory.build)
      } else if(s.room.needDumpers()) {
        s.thing.spawnARemoteCreep('dumper', s.room.memory.dump)
      }
    })
  }
  processCreeps(task, klass, method) {
    let creeps = _.filter(this.entities, e => { return !e.processed && e.type === 'creep' && e.thing.memory.task === task })
    _.each(creeps, c => {
      _.merge(Creep.prototype, klass.prototype)
      c.thing[method]()
    })
  }
  processBaitSquad() {
    let creeps = _.filter(this.entities, e => {return !e.processed && e.type === 'creep' && e.thing.memory.task === 'bait'})
    if(creeps.length >= 4) {
      BaitTactic.doAttack(creeps[0].thing.memory.home)
    }
  }
  processTowers() {
    _.each(Game.rooms, r=> {
      _.each(Finder.findMyTowers(r.name), t => { t.tower() })
    })
  }
  clearSpots() {
    let creeps = _.filter(this.entities, e => {return !e.processed && e.type === 'creep'})
    _.each(creeps, c =>{
     if(c && c.pos && c.room.name === 'E1N23' && c.pos.x === 15 && c.pos.y === 27) c.move(BOTTOM_RIGHT)
     if(c && c.pos && c.room.name === 'E1N23' && c.pos.x === 16 && c.pos.y === 27) c.move(RIGHT)
     if(c && c.pos && c.room.name === 'E1N23' && c.pos.x === 17 && c.pos.y === 27) c.move(RIGHT)
     if(c && c.pos && c.room.name === 'E1N23' && c.pos.x === 18 && c.pos.y === 27) c.move(RIGHT)
    })
  }
}
