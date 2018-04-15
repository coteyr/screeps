/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-08-14 18:06:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-12 03:59:59
*/

'use strict';
class BaitTactic {
  static doAttack(homeRoomName) {
    let says = ['You', 'have', 'not', 'enough', 'minerals']
    let opts =  {reusePath: 0,
      visualizePathStyle: {opacity: 0.75, stroke: Config.colors.red},
      ignoreCreeps: false,
      maxRooms: 1

    }
    let baits = _.filter(Game.creeps, e => {return  e.memory.task === 'bait' && e.memory.home === homeRoomName})
    let medic = _.filter(Game.creeps, e => {return  e.memory.task === 'medic' && e.memory.home === homeRoomName})
    let mostNeed = BaitTactic.mostNeededHeal(baits)
    _.each(baits, c =>{
      c.say(says[Game.time % 5], true)
      c.rangedMassAttack()
      let target = Targeting.findNearestTarget(c.pos)
      if(target) c.attack(target)
    })
    if(medic.length >= 1) {
      if(BaitTactic.inTargetRoom() && medic.room.name !== medic.memory.targetRoom) {
        let pos = new RoomPosition(25, 25, medic.memory.targetRoom)
        medic.moveTo(pos)
        return true
      }
      medic = medic[0]
      if(medic.room.name === medic.memory.targetRoom && medic.pos.x > 1 && medic.pos.y > 1) {
        let target = Targeting.findNearestTarget(medic.pos)
        if (target) {
          if(medic.hits < medic.hitsMax){
            medic.heal(medic)
          } else {
            medic.heal(mostNeed)
          }
        } else {
          let pos = BaitTactic.getRally(medic.room)
          if(BaitTactic.squadReady(baits, medic))  medic.moveTo(pos)
          mostNeed = Scalar.smallest(_.filter(Game.creeps, c => c.room.name === medic.room.name && c.hits < c.hitsMax), 'hits')
          if(mostNeed && mostNeed.hits < mostNeed.hitsMax) {
            medic.moveTo(mostNeed)
            medic.rangedHeal(mostNeed)
            medic.heal(mostNeed)
          }
        }
        let spot = 1
        let x = medic.pos.x
        let y = medic.pos.y
        _.each(baits, c =>{

          if(medic.pos.x === 23 && medic.pos.y === 24) {
            Log.info('g')
            if(spot = 1) {
              x = x + 1
            }
            if(spot = 2) {
              x = x - 1
            }
            if(spot = 3) {
              y = y + 1
            }
            if(spot = 4) {
              y = y - 1
            }
            let pos1 = new RoomPosition(x, y, medic.memory.targetRoom)
            Log.info(c.moveTo(pos1, opts))
            spot = spot + 1
          } else {
            if(BaitTactic.squadReady(baits, medic)) c.moveTo(medic.pos)
          }

        })

      // Attack Stuffs
      } else {
        let pos = new RoomPosition(25, 25, medic.memory.targetRoom)
        if(BaitTactic.squadReady(baits, medic) || medic.pos.x <= 1 || medic.pos.y <= 1) medic.moveTo(pos)
        _.each(baits, c =>{

          if(BaitTactic.squadReady(baits, medic)) c.moveTo(pos)

        })
      }
    //creep.say(says[Game.time % 5], true)
    }
  }
  static squadReady(baits, medic) {
    let ready = true
    _.each(baits, c =>{
      if(c.fatigue > 0) ready = false
      if(c.room.name !== medic.room.name) ready = true
    })

    return ready
  }
  static mostNeededHeal(baits) {
    return Scalar.smallest(baits, 'hits')
  }
  static inTargetRoom(baits) {
    let inRoom = false
    _.each(baits, c =>{
      if(c.memory.targetRoom === c.room.name) inRoom = true
    })
    return inRoom
  }
  static getRally(room) {
    let rally = _.filter(Game.flags, f => {return f.color === COLOR_PURPLE && f.room.name == room.name})
    Log.info(rally)
    if(rally.length > 0) {
      return rally[0]
    } else  if(room.controller){
      return room.controller
    } else {
      return new RoomPosition(25, 25, room.name)
    }
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-03-17 17:21:41
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-17 18:21:26
*/

'use strict';

class DenyTactic {
  static doAttack(creep, room) {
    if(!creep.pos.inRangeTo(room.controller.pos, 1)) creep.moveTo(room.controller.pos)
    creep.rangedMassAttack()
    creep.heal()
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-03-17 17:21:41
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-19 02:58:08
*/

'use strict';
class GuardTactic {
  static doAttack(creep, room) {
    creep.rangedMassAttack()
    let says = ['You', 'shall', 'not', 'pass']
    let opts =  {reusePath: 5,
      visualizePathStyle: {opacity: 0.75, stroke: Config.colors.red},
      ignoreCreeps: false,
      maxRooms: 1

    }
    creep.say(says[Game.time % 4], true)
    let wall = null
    if(creep.needsTarget()) creep.setTarget(Targeting.findAttackTarget(creep.pos))
    if(creep.hasTarget()) {
      Visualizer.target(creep.target())
      creep.moveTo(creep.target(), {ignoreDestructibleStructures: false, ignoreCreeps: false})
      creep.attack(creep.target())


    }
    if(creep.needsTarget()) {
      creep.moveTo(Targeting.getRally(creep))
    }
  }

}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-03-17 17:21:41
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-19 02:58:33
*/

'use strict';
class NormalTactic {
  static doAttack(creep, room) {
    creep.rangedMassAttack()
    let says = ['Lead', 'us', 'for', 'the', 'swarm']
    let opts =  {reusePath: 5,
      visualizePathStyle: {opacity: 0.75, stroke: Config.colors.red},
      ignoreCreeps: false,
      maxRooms: 1

    }
    creep.say(says[Game.time % 5], true)
    let wall = null
    if(creep.needsTarget()) creep.setTarget(Targeting.findAttackTarget(creep.pos))
    if(creep.hasTarget()) {
      Visualizer.target(creep.target())
      creep.moveTo(creep.target(), {ignoreDestructibleStructures: true, ignoreCreeps: false})
      creep.attack(creep.target())


    }
    var structures = creep.pos.findInRange(FIND_STRUCTURES, 1)
    let walls = _.filter(structures, s =>  { return s.type === "structure" && (s.structure.structureType === "constructedWall" || s.structureType == STRUCTURE_RAMPART) })//{ Log.info(JSON.stringify(s)) }) //return s.structureType == "constructedWall" }) // s.structureType === STRUCTURE_WALL })
    let smallest = 999999999
    _.each(walls, w => {
      if(w.structure.hits < smallest) {
        smallest = w.structure.hits
        wall = w.structure
      }
    })
    if(!_.isNull(wall)) creep.attack(wall)
    if(creep.needsTarget()) {
      creep.moveTo(Targeting.getRally(creep))
    }
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-06 21:45:14
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-04-03 23:16:16
*/

'use strict';

let EnergyCollectingCreep = function() {}

EnergyCollectingCreep.prototype.orignalPickup = Creep.prototype.pickup

EnergyCollectingCreep.prototype.pickup = function(target) {
  let result = null
  if(target.structureType == STRUCTURE_CONTAINER || target.structureType == STRUCTURE_STORAGE) {
    result = this.work(this.withdraw, target, Config.defaultRange, [RESOURCE_ENERGY])
  }
  if(target.resourceType == RESOURCE_ENERGY) {
    result  = this.work(this.orignalPickup, target, Config.defaultRange)
  }
  Log.error(result, this.name)
  if( result === ERR_NOT_IN_RANGE) Log.warn('Not In Range', this.name) //this.goTo(target)
  if( result === ERR_INVALID_TARGET) Log.warn('Not Valid Target') //this.clearTarget()
  if( result === OK ) this.clearTarget()
}

EnergyCollectingCreep.prototype.collectEnergy = function() {
  CpuAccounting.accountFor('work', () => {
    if(this.hasTarget() && !this.validateTarget([STRUCTURE_CONTAINER, RESOURCE_ENERGY, STRUCTURE_STORAGE])) this.clearTarget()
    if(this.needsTarget()) this.setTarget(Targeting.findExclusiveEnergy(this.room.name))
    if(this.hasTarget()) this.pickup(this.target())
    if(this.needsTarget()) this.setTask('idle')
    if(this.hasSome()) this.clearTarget()
  })

  //if(this.target() && this.validateTarget([STRUCTURE_CONTAINER, RESOURCE_ENERGY] ) && this.target().isFull()) this.clearTarget()
}

EnergyCollectingCreep.prototype.useEnergy = function (collectMethod, useMethod)  {
  if(this.isEmpty()) {
    this.memory.mode = 'collect'
    return collectMethod.apply(this, null)
  } else {
    this.memory.mode = 'use'
    return useMethod.apply(this, null)
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-07-03 15:12:45
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-21 22:43:53
*/

'use strict';
Creep.prototype.originalWithdraw = Creep.prototype.withdraw
Creep.prototype.originalPickup = Creep.prototype.pickup
Creep.prototype.orignalTransfer = Creep.prototype.transfer
Creep.prototype.orignalHarvest = Creep.prototype.harvest
Creep.prototype.orignalUpGradeController = Creep.prototype.upgradeController
Creep.prototype.originalMoveTo = Creep.prototype.moveTo
Creep.prototype.originalMove = Creep.prototype.move
Creep.prototype.orignalBuild = Creep.prototype.build
Creep.prototype.originalAttack = Creep.prototype.attack
Creep.prototype.orignalClaimController = Creep.prototype.claimController

Creep.prototype.pickup = function(target) {
  let result = null
  if(target.structureType == STRUCTURE_CONTAINER || target.structureType == STRUCTURE_STORAGE) {
    result = this.work(this.originalWithdraw, target, Config.defaultRange, [RESOURCE_ENERGY])
  }
  if(target.resourceType == RESOURCE_ENERGY) {
    result  = this.work(this.originalPickup, target, Config.defaultRange)
  }
  if( result === OK ) this.clearTarget()
  return result
}
Creep.prototype.harvest = function(target) {
  if(!target) {
    if(this.hasTarget()) {
      target = this.target()
    } else {
      this.setTarget(Targeting.findOpenSourceSpot(this.room.name))
      target = this.target()
    }
  }
  let result = this.work(this.orignalHarvest, target, Config.defaultRange)
  return result
}
Creep.prototype.build = function(target) {
  if(!target) {
    if(this.needsTarget('build')) this.setTarget(_.first(Finder.findConstructionSites(this.room.name)), 'build')
    if(this.hasTarget('build')) target = this.target('build')
  }
  return this.work(this.orignalBuild, target, Config.defaultRange)
}
Creep.prototype.attack = function(target) {
  return this.work(this.originalAttack, target, 1, {preWalk: true})
}

Creep.prototype.upgradeController = function() {
  let result = this.work(this.orignalUpGradeController, this.room.controller, Config.upgradeRange)
  return result
}
Creep.prototype.transfer = function(target) {
  let result = this.work(this.orignalTransfer, target, Config.defaultRange, [RESOURCE_ENERGY])
  return result
}
Creep.prototype.work = function(method, target, range, options = []) {
  if(!target) return false
  let start = Game.cpu.getUsed();
  let value = null;
  if(this.memory.inRange || this.pos.inRangeTo(target.pos.x, target.pos.y, range)) {
    this.memory.inRange = true
    value = method.apply(this, _.flatten([target, options]))
    Storage.addStat('account-cpu-work', Game.cpu.getUsed() - start)
    if(value === ERR_NOT_IN_RANGE) delete this.memory.inRange
  } else {
    if(!options.preWalk) {
      value = this.goTo(target)
    }
    Storage.addStat('account-cpu-move', Game.cpu.getUsed() - start)
  }
  return value
}

Creep.prototype.moveTo = function(firstArg, secondArg, opts) {

  if(this.fatigue > 0) return ERR_TIRED
  if(this.room.name === "E3N24" && this.pos.x >= 17 && this.pos.x <= 24 && this.pos.y >= 33 && this.pos.y <= 39) {
    opts = { ignoreCreeps: true}
    // Log.info(firstArg)
    // Log.info(Finder.findCreepsInArea(this.room.name, 33, 19, 38, 23).length)
    if(Finder.findCreepsInArea(this.room.name, 33, 19, 38, 23).length > 0) {
      if(Storage.read("moveOne" + this.room.name, true)) {
        Storage.write("moveOne" + this.room.name, false)
      } else {
        this.memory.evac = true
      }

    }
  }
  if(this.pos.x === 25 && this.pos.y === 39) delete this.memory.evac
  if(this.memory.evac === true) {
    return this.originalMoveTo(new RoomPosition(25, 39, this.room.name), opts)
  }
  if(this.room.name === "W44S9" && this.pos.x >= 34 && this.pos.x <= 42 && this.pos.y >= 40 && this.pos.y <= 42) {
    opts = { ignoreCreeps: true, reusePath: 0}
  }

  let empty = Targeting.findCloseEmptyExtension(this.pos)
  if(empty) {
    this.transfer(empty, RESOURCE_ENERGY)
  }
  return this.originalMoveTo(firstArg, secondArg, opts)
}


Creep.prototype.move = function(direction) {
  let things = this.pos.look()
  _.each(things, t => {
    if(t.type === 'structure' && t.structure.structureType === STRUCTURE_ROAD) this.repair(t.structure)
    if(this.pos.x > this.room.memory.right || this.pos.x < this.room.memory.left || this.pos.y > this.room.memory.bottom || this.pos.y < this.room.memory.top) return false
    // if(Finder.findConstructionSites(this.room.name).length < Config.maxConstructionSites && (t.type === 'terrain' && t.terrain === 'plain' || t.type === 'terrain' && t.terrain === 'swamp')) this.room.createConstructionSite(this.pos, STRUCTURE_ROAD)
  })
  let start = Game.cpu.getUsed();
  this.originalMove(direction)
}

Creep.prototype.claimController = function() {
  let result = this.work(this.orignalClaimController, this.room.controller, Config.defaultRange)
  return result
}
Creep.prototype.gotoTargetRoom = function() {
  if(this.room.name === this.memory.targetRoom) {
    return true
  } else {
    let pos = new RoomPosition(25, 25, this.memory.targetRoom)
    this.moveTo(pos)
    return false
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-19 07:36:43
*/

'use strict';

let AttackCreep = function() {}
AttackCreep.prototype.attacker = function() {
  if(this.gotoTargetRoom()) {
    NormalTactic.doAttack(this,this.room)
  }
}




/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-19 07:30:39
*/

'use strict';
let BuilderCreep = function() {}


BuilderCreep.prototype.builder = function() {
  if(this.needEnergy()) {
    if(this.hasTarget()) {
        this.pickup(this.target())
      } else {
        this.setTarget(Targeting.findExclusiveEnergy(this.room.name))
      }
  } else {
    this.build()
  }
}

/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-06 21:43:54
*/

'use strict';

let ClaimerCreep = function() {}
ClaimerCreep.prototype.superTick = function() {
  if(this.room.name !== this.memory.targetRoom) {
    let pos = new RoomPosition(25, 25, this.memory.targetRoom)
    this.moveTo(pos)
  }
  if(this.room.name === this.memory.targetRoom) {
    if(this.room.controller) {
      if(this.claimController(this.room.controller) == ERR_NOT_IN_RANGE) {
        this.moveTo(this.room.controller);
      }
    }
  }
}
ClaimerCreep.prototype.claimer = function() {
  if(this.room.name === this.memory.target) {
    this.claimController();
    // claim controller
  } else {
    let pos = new RoomPosition(25, 25, this.memory.target)
    this.moveTo(pos)
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:14:00
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-26 14:41:13
*/

'use strict';
Creep.prototype.type = 'creep'
Creep.prototype.chooseFillStatus = function() {
  if(this.isEmpty()) {
    this.memory.status = 'fill'
    this.clearTarget('drop')
  }
  if(this.isFull()) {
    this.memory.status = 'empty'
    this.clearTarget()
  }

}
Creep.prototype.partCount = function(part) {
  return _.filter(this.body, {type: part}).length
}
Creep.prototype.taskIs = function(task) {
  return (this.memory.task === task)
}
Creep.prototype.setTask = function(task) {
  this.memory.task = task
  Log.debug(task)
  return true
}
Creep.prototype.tick = function(kernel) {
  kernel.register(this, 'unknown')
}
Creep.prototype.targetIs = function(id, key = 'target') {
  return this.memory["target-" + key] === id
}
Creep.prototype.setTarget = function(target, key = 'target') {
  if(_.isNull(target) || _.isUndefined(target)) return false
  if(_.isUndefined(target.id)) return false
  this.memory["target-" + key] = target.id
  return true
}
Creep.prototype.hasTarget = function(key = 'target') {
  return !_.isUndefined(this.memory["target-" + key]) && !_.isNull(this.memory["target-" + key]) && !_.isNull(Game.getObjectById(this.memory["target-" + key])) && Game.getObjectById(this.memory["target-" + key]).room.name === this.room.name
}
Creep.prototype.needsTarget = function( key = 'target') {
  return !this.hasTarget(key)
}
Creep.prototype.target = function(key = 'target') {
  return Game.getObjectById(this.memory["target-" + key])
}
Creep.prototype.isEmpty = function() {
  return _.sum(this.carry) === 0
}
Creep.prototype.isFull = function() {
  return _.sum(this.carry) >= this.carryCapacity
}
Creep.prototype.hasSome = function() {
  return !this.isEmpty()
}
Creep.prototype.clearTarget = function(key = 'target') {
  delete this.memory["target-" + key]
  return true
}
Creep.prototype.validateTarget = function(validTargets, key = 'target') {
  let valid = false
  _.each(validTargets, t => {
    if(t.structureType && t.structureType === t) valid = true
    if(t.resourceType && t.resourceType === t) valid = true
  })
  if(!valid) this.clearTarget(key)
  return valid
}


Creep.prototype.goTo = function(pos) {
  let opts = {costCallback: function(roomName, costMatrix) {
    for(let x = 0; x++; x < 50) {
      costMatrix.set(x, 0, 256)
      costMatrix.set(x, 49, 256)
      costMatrix.set(0, x, 256)
      costMatrix.set(49, x, 256)
    }
    /*costMatrix.set(21, 18, 256)
    costMatrix.set(21, 20, 256)*/
    //_.each(Finder.findCreepsWithTask(pos.room.name, 'mine'), c => {
    //  costMatrix.set(c.pos, 255)
    //})
    },
  reusePath: 5,
  ignoreCreeps: Game.time % 5 !== 0,  //false,
  visualizePathStyle: {opacity: 0.75, stroke: Config.colors.blue},
  maxRooms: 1
  }
  // Log.info(JSON.stringify(arguments))
  this.room.visual.circle(pos, { fill: Config.colors.blue,  opacity: 1.0, radius: 0.25} )
  return this.moveTo(pos, opts)
}


Creep.prototype.orignalRepair = Creep.prototype.repair
Creep.prototype.repair = function(target) {
  this.work(this.orignalRepair, target, Config.defaultRange)
}

Creep.prototype.orignalAttack = Creep.prototype.attack
Creep.prototype.attack = function(target) {
  let start = Game.cpu.getUsed();
  this.orignalAttack(target)
  Storage.addStat('account-cpu-attack', Game.cpu.getUsed() - start)
}
Creep.prototype.needEnergy = function() {
  if(this.isEmpty()) {
    this.memory.status = 'fill'
  }
  if(this.isFull()) {
    this.memory.status = 'empty'
    this.clearTarget()
  }
  return this.memory.status === 'fill'
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-19 07:36:18
*/

'use strict';

let DancerCreep = function() {}
AttackCreep.prototype.dancer = function() {
  if(this.gotoTargetRoom()) {
    this.rangedMassAttack()
  }
}




/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-19 07:39:02
*/

'use strict';

let DumperCreep = function() {}

DumperCreep.prototype.dumper = function() {
  this.chooseFillStatus()
  if(this.memory.status === 'fill') {
    if(this.room.name === this.memory.home) {
      // fill up

        this.pickup(this.room.storage)

    } else {
      let pos = new RoomPosition(25, 25, this.memory.home)
      this.moveTo(pos)
    }
  } else {
    if(this.gotoTargetRoom()) {
      this.upgradeController()
    }
  }
}



/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-19 07:37:46
*/

'use strict';

let GaurdCreep = function() {}
GaurdCreep.prototype.gaurd = function() {
  if(this.gotoTargetRoom()) {
    GuardTactic.doAttack(this,this.room)
  }
}




/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-07-07 04:19:16
*/

'use strict';
let HaulerCreep = function() {}
//_.merge(HaulerCreep.prototype, EnergyCollectingCreep.prototype)

HaulerCreep.prototype.haul = function() {
  if(this.needEnergy()) {
    if(this.hasTarget()) {
        this.pickup(this.target())
      } else {
        this.setTarget(Targeting.findExclusiveEnergy(this.room.name))
      }
  } else {

      if(this.needsTarget('drop')) this.setTarget(Targeting.findClosestEnergyStoreInNeed(this.pos), 'drop') // this.setTarget(Finder.findEnergyStoreInNeed(this.room.name))
      if(this.hasTarget('drop')) {
        this.transfer(this.target('drop'))
        if(this.target('drop').isFull()) this.clearTarget('drop')
      }
      if(this.isEmpty()) this.clearTarget('drop')
  }
}




/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-14 21:46:43
*/

'use strict';

let MedicCreep = function() {}
MedicCreep.prototype.medic = function() {
  if(this.room.name === this.memory.targetRoom && this.pos.x > 1 && this.pos.y > 1) {
    let mostNeed = Scalar.smallest(_.filter(Game.creeps, c => c.room.name === this.room.name && c.hits < c.hitsMax), 'hits')
    if(mostNeed) {
      this.moveTo(mostNeed)
      this.heal(mostNeed)
    }
  } else {
    let pos = new RoomPosition(25, 25, this.memory.targetRoom)
    this.moveTo(pos)
  }
}




/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:15
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-07-03 15:13:31
*/

'use strict';
let MinerCreep = function() {}
MinerCreep.prototype.mine = function() {
  if(this.hasTarget()) {
      this.harvest(this.target())
    } else {
      this.setTarget(Targeting.findOpenSourceSpot(this.room.name))
    }
}



/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-06-09 17:08:12
*/

'use strict';

let NullCreep = function() {}
NullCreep.prototype.superTick = function() {
    this.room.visual.text('\u231B', this.pos, {color: Config.colors.yellow, size: 0.25})
    Log.warn(["Creep", this.name, "has no tasks"])
    if(Finder.findEnergy(this.room.name).length > 2) {
      _.merge(Creep.prototype, UpgraderCreep.prototype)
      this.superTick()
    } else {
      let pos = new RoomPosition(this.room.controller.pos.x + 3, this.room.controller.pos.y + 3, this.room.name)
      this.goTo(pos)
      if(this.hasSome()) this.setTask('haul')
    }

  }
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-06-29 21:13:13
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-19 07:35:14
*/

'use strict';
let RecoveryCreep = function() {}
RecoveryCreep.prototype.recover = function() {
  this.chooseFillStatus()
  if(this.memory.status === 'fill') {
    this.harvest()
  } else {
    this.doRecoveryWork()
  }
}
RecoveryCreep.prototype.doRecoveryWork = function() {
  if(this.room.isFull()) {
    this.upgradeController()
  } else {
    if(this.needsTarget('drop')) this.setTarget(Targeting.findClosestEnergyStoreInNeed(this.pos), 'drop') // this.setTarget(Finder.findEnergyStoreInNeed(this.room.name))
    if(this.hasTarget('drop')) {
      this.transfer(this.target('drop'))
      if(this.target('drop').isFull()) this.clearTarget('drop')
    }
  }
}


/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-19 07:36:06
*/

'use strict';

let RemoteBuilderCreep = function() {}
RemoteBuilderCreep.prototype.remoteBuilder = function() {
  if(this.gotoTargetRoom()) {
    this.chooseFillStatus()
    if(this.memory.status === 'fill') {
      this.harvest()
    } else {
      this.build()
    }
  }
}




/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-27 17:08:00
*/

'use strict';
let RepairCreep = function() {}
_.merge(RepairCreep.prototype, EnergyCollectingCreep.prototype)

RepairCreep.prototype.superTick = function() {
  this.useEnergy(this.collectEnergy, this.repairThings)
  // this.room.visual.text('M', this.pos, {color: Config.colors.yellow, size: 0.25})
}

RepairCreep.prototype.repairThings = function() {
  if(this.needsTarget()) this.setTarget(Targeting.findRepairTarget(this.pos))
  if(this.hasTarget()) this.repair(this.target())
  if(this.hasTarget() && this.target().hits >= this.target().hitsMax) this.clearTarget()
  if(this.needsTarget()) this.setTask('idle')
  // if(this.isEmpty()) this.clearTarget()
}

/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-07-03 15:52:19
*/

'use strict';
let UpgraderCreep = function() {}
UpgraderCreep.prototype.upgrade = function() {
  if(this.isEmpty()) {
    if(this.needsTarget()) {
      this.setTarget(Targeting.findExclusiveEnergy(this.room.name))
    } else {
      this.work(this.pickup, this.target(), Config.defaultRange)
    }
  } else {
    this.upgradeController()
  }
}


/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-21 23:07:00
*/

'use strict';
let WallerCreep = function() {}


WallerCreep.prototype.waller = function() {
  this.chooseFillStatus()
  if(this.memory.status === 'fill') {
    if(this.needsTarget()) {
      this.setTarget(Targeting.findExclusiveEnergy(this.room.name))
    } else {
      this.work(this.pickup, this.target(), Config.defaultRange)
    }
  } else {
    if(this.needsTarget('wall')) {
      let target = Targeting.findWeakestWall(this.pos)
      this.setTarget(target, 'wall')
    }
    if(this.hasTarget('wall')) {
      this.repair(this.target('wall'))
    }
    if(this.isEmpty()) {
      this.clearTarget('wall')
      this.clearTarget()
    }
  }
}

/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-06-28 22:18:46
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-06-28 22:38:56
*/

'use strict';
class Configurator {
  constructor() {

  }
  getValue(key, configKey = false) {
    let value = Storage.read("Config-" + key, null)
    if(value === null && configKey) value = configKey
    if(value !== null) Storage.write("Config-" + key, value)
    return value
  }
  setValue(key, value) {
    return Storage.write("Config-" + key, value)
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-02 22:46:08
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-02 22:47:46
*/

'use strict';

class Counter {
  static number() {
    let oldNumber = Storage.read('unique-id', 0)
    let newNumber = oldNumber + 1
    Storage.write('unique-id', newNumber)
    return newNumber
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-06-28 22:13:52
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-06-28 22:15:45
*/

'use strict';
class Cpu {
  constructor() {
    this.start = Game.cpu.getUsed()
  }
  usedCpu() {
    return Game.cpu.getUsed() - this.start
  }
  limit() {
    return Game.cpu.limit
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-04-03 22:53:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-04-03 23:15:54
*/

'use strict';
class CpuAccounting {
  static accountFor(tag, func, scope = null, args = []) {
    let start = Game.cpu.getUsed();
    let retValue = func.apply(scope, args);
    let end = Game.cpu.getUsed()
    Storage.addStat('account-cpu-' + tag, end - start)
    return retValue
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-03-18 00:05:22
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-18 00:08:26
*/

'use strict';

class CpuConservation {
  static haveCpu() {
    return Game.cpu.getUsed() < (0.90 * Game.cpu.limit)
  }
  static haveBucket() {
    return Game.cpu.getUsed() < (Game.cpu.tickLimit * 0.90) && Game.cpu.bucket > 50
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-12 21:38:54
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-14 13:51:38
*/

'use strict';

class Error {
  static niceError(error) {
    let message = error
    switch(error) {
      case ERR_NOT_OWNER:
      message = "You do not own that object"
      break;
      case ERR_NO_PATH:
      message = "Could not find path"
      break;
      case ERR_NAME_EXISTS:
      message = "Name already exists"
      break;
      case ERR_BUSY:
      message = "Object is busy"
      break;
      case ERR_NOT_FOUND:
      message = "Object could not be found"
      break;
      case ERR_NOT_ENOUGH_ENERGY:
      message = "Not enough Energy"
      break;
      case ERR_NOT_ENOUGH_RESOURCES:
      message = "Not Enough Resources"
      break;
      case ERR_INVALID_TARGET:
      message = "Invalid Target"
      break;
      case ERR_FULL:
      message = "Object Full"
      break;
      case ERR_NOT_IN_RANGE:
      message = "Object not in range"
      break;
      case ERR_INVALID_ARGS:
      message = "Invalid Arguments passed to API"
      break;
      case ERR_TIRED:
      message = "To tired"
      break;
      case ERR_NO_BODYPART:
      message = "No Body part to execute that action"
      break;
      case ERR_NOT_ENOUGH_EXTENSIONS:
      message = "Not enough extensions"
      break;
      case ERR_RCL_NOT_ENOUGH:
      message = "RCL Level is not high enough"
      break;
      case ERR_GCL_NOT_ENOUGH:
      message = "GCL level is not high enough"
      break;
    }
    return error
  }
  static worked(returnValue, object = null) {
    if(returnValue === OK) return true
    Error.logError(returnValue, object)
    return false
  }
  static logError(returnValue, object = null) {
    let name = "Unknown"
    if(!_.isNull(object) && !_.isUndefined(object) && !_.isUndefined(object.name)) name = object.name
    if(!_.isNull(object) && !_.isUndefined(object) && !_.isUndefined(object.room)) name = object.room.name
    if(returnValue === OK) {
      Log.debug('OK')
    } else {
      Log.error(['Error Processing Command:', Formatter.color(Config.colors.purple, Error.niceError(returnValue))], name)
    }
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-02 22:12:59
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-08 14:58:32
*/

'use strict';

class Finder {
  static findCreeps(room_name) {
    return CpuAccounting.accountFor('finder', () =>{
      return _.filter(Game.creeps, c => {return c.my && c.room.name === room_name})
    })
  }
  static findAttackCreeps(room_name) {
    return _.filter(Finder.findCreeps(room_name), c => { return c.memory.task === 'attack' })
  }
  static findIdleCreeps(room_name) {
    return CpuAccounting.accountFor('finder', () => {
      return _.filter(Game.creeps, c => {return c.my && c.room.name === room_name && c.taskIs('idle')})
    })
  }
  static findIdleSpawn(room_name) {
    return _.find(Game.spawns, s => { return s.room.name === room_name && _.isNull(s.spawning)})
  }
  static findSources(room_name) {
    let room = Game.rooms[room_name]
    return room.find(FIND_SOURCES)
  }
  static findMinirals(roomName) {
    let room = Game.rooms[roomName]
    return room.find(FIND_MINERALS)
  }
  static findCreepsInArea(roomName, top, left, bottom, right) {
    return _.filter(Game.creeps, c => { return c.room.name === roomName  && c.pos.y >= top && c.pos.y <= bottom && c.pos.x >= left && c.pos.x <= right} )
  }
  static findCreepsWithTask(room_name, task){
    return _.filter(Game.creeps, c => {return c.my && c.memory.home === room_name && c.taskIs(task)})
  }
  static findCreepsWithTarget(id) {
    return _.filter(Game.creeps, c => {return c.my && c.targetIs(id)})
  }
  static findCreepsNearSpawn(spawn) {
    return spawn.pos.findInRange(FIND_MY_CREEPS, 1)
  }
  static findSpotsAroundTarget(id){
    let source = Game.getObjectById(id)
    let count = 0
    let spots = []
    source.room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true).forEach(function(spot) {
        if (spot.terrain === 'plain' || spot.terrain === 'swamp') {
          spots.push(spot)
        }
      })
    return spots
  }
  static findObjects(roomName, objectType) {
    let room = Game.rooms[roomName]
    return room.find(objectType)
  }
  static findMyStructures(roomName, structureType) {
    return _.filter(Finder.findObjects(roomName, FIND_MY_STRUCTURES), s => { return s.structureType === structureType})
  }
  static findDroppedEnergy(roomName) {
    let room = Game.rooms[roomName]
    let minEnergy = Config.minEnergy[room.controller.level]
    let containers = _.filter(Finder.findObjects(roomName, FIND_STRUCTURES), s => { return s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > minEnergy})
     //if(containers.length > 0) return containers
    let drops =  _.filter(Finder.findObjects(roomName, FIND_DROPPED_RESOURCES), r => { return r.resourceType === RESOURCE_ENERGY && r.amount >= (minEnergy * 2) && r.pos.x > room.memory.left && r.pos.x < room.memory.right && r.pos.y > room.memory.top && r.pos.y < room.memory.bottom})
    // if(drops.length > 0) return drops
    if((room.storage && !room.storage.critical) || room.memory.attack) return [room.storage].concat(containers, drops)
    return containers.concat(drops)
  }
  static findEnergy(roomName) {
    let room = Game.rooms[roomName]
    let minEnergy = Config.minEnergy[room.controller.level]
    let containers = _.filter(Finder.findObjects(roomName, FIND_STRUCTURES), s => { return s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > minEnergy})
    let storage = room.storage
    if(storage && storage.critical()) storage = undefined
    let drops = _.filter(Finder.findObjects(roomName, FIND_DROPPED_RESOURCES), r => { return r.resourceType === RESOURCE_ENERGY && r.amount >= (minEnergy * 2) && Scalar.inBounds(r.pos, roomName)})
    return [].concat(containers, storage, drops)
  }
  static findExtensions(roomName){
    return Finder.findMyStructures(roomName, STRUCTURE_EXTENSION)
  }
  static findLabs(roomName) {
    return Finder.findMyStructures(roomName, STRUCTURE_LAB)
  }
  static findExtractor(roomName) {
    return Finder.findMyStructures(roomName, STRUCTURE_EXTRACTOR)
  }
  static findConstructionSites(roomName, type = null){
    if(!_.isNull(type)) return _.filter(Finder.findObjects(roomName, FIND_CONSTRUCTION_SITES), c => { return c.my && c.structureType === type})
    return _.filter(Finder.findObjects(roomName, FIND_CONSTRUCTION_SITES), c => { return c.my })
  }
  static findSpawns(roomName) {
    return Finder.findMyStructures(roomName, STRUCTURE_SPAWN)
  }
  static findMyTowers(roomName) {
    return Finder.findMyStructures(roomName, STRUCTURE_TOWER)
  }
  static findMyRamps(roomName) {
    return Finder.findMyStructures(roomName, STRUCTURE_RAMPART)
  }
  static findWalls(roomName) {
    let walls = _.filter(Finder.findObjects(roomName, FIND_STRUCTURES), o => { return o.structureType === STRUCTURE_WALL })
    return walls
  }
  static findEnergyStoreInNeed(roomName) {
    let spawns = _.filter(Finder.findSpawns(roomName), s => { return s.hasRoom() })
    let towers = _.filter(Finder.findMyTowers(roomName), t => { return t.hasRoom() })
    let criticalTower = null
    _.each(towers, t => { if(t.critical()) criticalTower = t })
    if(criticalTower) return [criticalTower]
    if(spawns.length > 0) return spawns
    let extensions = _.filter(Finder.findExtensions(roomName), e => { return e.hasRoom() })
    //if(towers.length > 0  && Game.time % 5 == 0) return towers
    if(extensions.length > 0) return extensions
    if(towers.length > 0) return towers
    return [Game.rooms[roomName].storage]
  }
  static findFlag(roomName, flagName) {
    return Game.flags[flagName]
  }
  static findFlagByColor(roomName, color1, color2) {
    return _.first(_.filter(Game.flags, f=> { return f.room.name == roomName && f.color == color1 && f.secondaryColor == color2}))
  }
  static findSpawnConstruction(roomName){
    return _.first(Finder.findConstructionSites(roomName, STRUCTURE_SPAWN))
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 09:51:44
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-01-15 09:44:38
*/

'use strict';

class Formatter {
  static color(color, text) {
    return Formatter.wrap(['color', color], text)
  }
  static size(size, text) {
    return Formatter.wrap(['font-size', size], text)
  }
  static font(family, text) {
    return Formatter.wrap(['font-family', family], text)
  }
  static wrap(css, text) {
    return "<span style='" + css[0] +": " + css[1] + "; '>" + text + "</span>"
  }
  static build(messages) {
    return messages.join(' ')
  }
  static jsonSyntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var color = Config.colors.green //'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
            color = Config.colors.purple; //key
        } else {
            color = Config.colors.grey; // 'string';
        }
      } else if (/true|false/.test(match)) {
          color = Config.colors.yellow; //boolean
      } else if (/null/.test(match)) {
          color = Config.colors.red; //'null';
      }
      return Formatter.wrap(['color', color], match)//'<span class="' + cls + '">' + match + '</span>';
    });
  }
  static toFixed(value){
    let attempt = parseFloat(value)
    if(Number.isNaN(attempt)) {
      return "0.00"
    } else {
      return attempt.toFixed(2)
    }
  }
  static localTimeString(date) {
    let utc = date.getTime() + (date.getTimezoneOffset() * 60000)
    return new Date(utc + (60000 * Config.l10n.timeZoneOffset)).toLocaleString()
  }

}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-19 13:50:37
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-11 22:46:52
*/

'use strict';

global.resetWalls = function(roomName) {
  let room = Game.rooms[roomName]
  delete room.memory.top
  delete room.memory.bottom
  delete room.memory.left
  delete room.memory.right
  global.addWalls(roomName)

}
global.addWalls = function(roomName) {
  RoomBuilder.addWalls(roomName)
}
global.addRamps = function(roomName) {
  RoomBuilder.addRamps(roomName)
}
global.showWalls = function(roomName) {
  let room = Game.rooms[roomName]
  Visualizer.showSquares(roomName, Storage.read(room.name + '-wall-spots', []), Config.colors.purple)
}
global.showRamps = function(roomName) {
  let room = Game.rooms[roomName]
  Visualizer.showSquares(roomName, Storage.read(room.name + '-ramp-spots', []), Config.colors.green)
}
global.showExtensions = function(roomName) {
  let room = Game.rooms[roomName]
  Visualizer.showCircles(roomName, Storage.read(room.name + '-extension-spots', []), Config.colors.red, true)
}
global.pruneWalls = function(roomName) {
  RoomBuilder.pruneWalls(roomName)
}
global.clearBuiltWalls = function(roomName) {
  RoomBuilder.clearBuiltWalls(roomName)
  RoomBuilder.clearBuiltRamps(roomName)
}
global.removeWall = function(roomName, x, y) {
  RoomBuilder.removeWallSpot(roomName, x, y)
  global.showWalls(roomName)
  global.showRamps(roomName)
}
global.planExtensions = function(roomName) {
  RoomBuilder.buildOutExtensions(roomName)
}
global.resetTarget = function(roomName) {
  _.each(Game.creeps, c => {
    if(c.room.name === roomName) {
      c.clearTarget()
      delete c.memory.wall
    }
  })
}
global.reAttack = function(source, destination) {
  _.each(Game.creeps, c => {
    if(c.memory.task === 'attacker' && c.memory.targetRoom === source) {
      c.memory.targetRoom = destination
    }
  })
}
global.clearAttack =  function() {
  _.each(Game.rooms, r => { delete r.memory.attack })
}
global.displayCpuAccounting = function() {
  _.each(Object.keys(STATS), key => {
    Log.print([key, ':', STATS[key]])
  })
}
global.toggleHud = function() {
  let config = new Configurator()
  let value = config.getValue('showHud', Config.showHud)
  if(value === true){
    value = false
  } else {
    value = true
  }
  Log.feedback(['Set the HUD to', config.setValue('showHud', value)])
}

/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-03-30 22:55:47
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-06-28 22:25:45
*/

'use strict';

class Hud {
  constructor() {
    this.lines = []
  }
  addLine(title, value, total, color = Config.colors.white) {
    this.lines.push({name: title, value: value, total: total, color: color})
  }
  display() {

    let position = 0
    let visual = new RoomVisual()
    visual.rect(0, 0, 18, _.size(this.lines) + 1, {fill: '#000000', opacity: 1})
    _.each(this.lines, l=> {
      position ++
      // visual.text(l.name, 1, position + 0.5)
      let pct = (l.value / l.total) * 10
      if (_.isNull(l.color)) l.color = Hud.colorize(pct)
      if (l.color === true) l.color = Hud.colorize(10 - pct)
      visual.text(l.name, 1, position, { align: 'left' })
      visual.rect(7, position - 0.5,  10, 0.5, {fill: Config.colors.gray})
      visual.rect(7, position - 0.5,  pct, 0.5, {fill: l.color, opacity: 1})
      visual.text(l.value.toFixed(0) + '/' + l.total.toFixed(0), 7 + (pct / 2), position - 0.1, {font: 0.5, align: 'left', color: '#000000'})
    })

  }
  static colorize(pct) {
    if (pct >= 0 && pct < 3) return Config.colors.green
    if (pct >= 3 && pct < 6) return Config.colors.blue
    if (pct >= 6 && pct < 8) return Config.colors.yellow
    return Config.colors.red
  }

}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-06-28 21:58:44
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-21 22:41:13
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
    this.processCreeps('waller', WallerCreep, 'waller')
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
      } else if(s.room.needWaller()) {
        s.thing.spawnACreep('waller')
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
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 09:51:44
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-06-28 22:39:58
*/

'use strict';

class Log {
  static info(message, object = null) {
    if (Config.logLevel >= 4) Log.output(Config.colors.white, message, object)
  }
  static warn(message, object = null) {
    if (Config.logLevel >= 2) Log.output(Config.colors.yellow, message, object)
  }
  static error(message, object = null) {
    if (Config.logLevel >= 1) Log.output(Config.colors.red, message, object)
  }
  static debug(message, object = null) {
    if (Config.logLevel >= 3) Log.output(Config.colors.gray, message, object)
  }
  static print(message, name = null) {
    if (Config.logLevel >= 0) Log.output(Config.colors.white, message, name)
  }
  static feedback(message, name = null) {
    Log.output(Config.colors.blue, message, name)
  }
  static tick(){
    console.log(Formatter.build([Formatter.color(Config.colors.purple, "Tick:"),  Formatter.color(Config.colors.green, Game.time)]))
  }
  static output(color, message, object = null) {
    let name = null
    if(!_.isNull(object)) {
      if(!_.isUndefined(object.name)) {
        name = object.name
      } else {
        name = object
      }
    }
    if (_.isArray(message)) message = Formatter.build(message)
    if (name) message = Formatter.build([Formatter.color(Config.colors.blue, name), Formatter.color(Config.colors.gray, '::'), message])
    console.log(Formatter.size(Config.fonts.size, Formatter.font(Config.fonts.mono, Formatter.color(color, message))))
    // console.log("<span style=' font-family: " + Config.fonts.mono + "; font-size: " + Config.fonts.size + "; color: " + color + "'>" + message + '</span>')
  }
  static json(object) {
    console.log(Formatter.jsonSyntaxHighlight(object))
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-10 22:17:29
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-04-01 23:41:07
*/

'use strict';

class RoomBuilder {
  static buildPlan(roomName) {
    let room = Game.rooms[roomName]
    if(Finder.findSpawns(room.name).length === 0) return false
    if(RoomBuilder.needMainArea(roomName)) RoomBuilder.findMainArea(roomName)
    if(_.isUndefined(room.memory.planed)) {
      RoomBuilder.addWalls(roomName)
      RoomBuilder.addRamps(roomName)
      //RoomBuilder.pruneWalls(roomName)
      RoomBuilder.buildOutExtensions(roomName)
      room.memory.planed = true
    }
  }
  static buildOutExtensions(roomName) {
    let extensionSpots = []
    let room = Game.rooms[roomName]
    if(_.isNull(room)) return false
    let spawn = _.first(Finder.findSpawns(room.name))
    if(_.isUndefined(spawn)) return false
    if(RoomBuilder.needMainArea(roomName))  return false
    let y = spawn.pos.y
    let x = spawn.pos.x

    x = room.memory.left + 2
    y = room.memory.top + 1

    while (y < room.memory.bottom) {
      while (x < room.memory.right) {
        extensionSpots.push({x: x, y: y})
        x = x + 2
      }
      if(y % 2 === 0) {
        x = room.memory.left + 1
      } else {
        x = room.memory.left + 2
      }
      y = y + 1
    }
    let spots = []
    _.each(extensionSpots, e => {
      if((e.x < spawn.pos.x - 1 || e.x > spawn.pos.x + 1 || e.y > spawn.pos.y + 1 || e.y < spawn.pos.y - 1)) {
        spots.push({x: e.x, y: e.y})
      }
    })
    spots = Scalar.orderByPos(spawn.pos, spots)
    Storage.write(room.name + '-extension-spots', spots)
    return spots
  }
  static findBoundries(structures, spawns, roomName) {
    let top = 50
    let bottom = 0
    let left = 50
    let right = 0
    let room = Game.rooms[roomName]
    _.each(structures, s => {
      if(s.pos.y - Config.wallSpacing < top) top = s.pos.y - Config.wallSpacing
      if(s.pos.y + Config.wallSpacing > bottom) bottom = s.pos.y + Config.wallSpacing
      if(s.pos.x - Config.wallSpacing < left) left = s.pos.x - Config.wallSpacing
      if(s.pos.x + Config.wallSpacing > right) right = s.pos.y + Config.wallSpacing
        _.each(spawns, p => {
          let path = room.findPath(p.pos, s.pos, {ignoreCreeps: true, ignoreDestructibleStructures: true})
          Log.error(path.length)
          _.each(path, a => {
            if(a.y - Config.wallSpacing < top) top = a.y - Config.wallSpacing
            if(a.y + Config.wallSpacing > bottom) bottom = a.y + Config.wallSpacing
            if(a.x - Config.wallSpacing < left) left = a.x - Config.wallSpacing
            if(a.x + Config.wallSpacing > right) right = a.x + Config.wallSpacing
          })
        })
    })
    if(top < 2) top = 2
    if(bottom > 47) bottom = 47
    if(left < 2) left = 2
    if(right > 47) right = 47
    return {'top': top, 'left': left, 'bottom': bottom, 'right': right}
  }
  static findMainArea(roomName) {
    let room = Game.rooms[roomName]
    let sources = Finder.findSources(room.name)
    let spawns = Finder.findSpawns(room.name)
    let controller = room.controller
    let boundries = RoomBuilder.findBoundries(sources.concat(spawns, [controller]), spawns, roomName)
    room.memory.top = boundries.top
    room.memory.bottom = boundries.bottom
    room.memory.left = boundries.left
    room.memory.right = boundries.right
    return true
  }
  static needMainArea(roomName) {
    let room = Game.rooms[roomName]
    return _.isUndefined(room.memory.top) || _.isUndefined(room.memory.bottom) || _.isUndefined(room.memory.left) || _.isUndefined(room.memory.right)
  }
  static addWalls(roomName) {
    if(RoomBuilder.needMainArea(roomName)) RoomBuilder.findMainArea(roomName)
    let room = Game.rooms[roomName]
    let spots = []
    let ramps = []
    let x = 0
    let y = 0
    for(x = room.memory.left - 4; x <= room.memory.right + 4; x++) {
      if(x <= room.memory.right && x >= room.memory.left) {
        spots.push({x: x, y: room.memory.top})
        spots.push({x: x, y: room.memory.bottom})
      }
      if (x <= room.memory.right + 2 && x >= room.memory.left - 2) {
        spots.push({x: x, y: room.memory.top - 2})
        spots.push({x: x, y: room.memory.bottom + 2})
      }
      spots.push({x: x, y: room.memory.top - 4})
      spots.push({x: x, y: room.memory.bottom + 4})
    }
    for(y = room.memory.top - 4; y <= room.memory.bottom + 4; y++) {
      if(y <= room.memory.bottom && y >= room.memory.top) {
        spots.push({x: room.memory.left, y: y})
        spots.push({x: room.memory.right, y: y})
      }
      if(y <= room.memory.bottom + 2 && y >= room.memory.top - 2) {
        spots.push({x: room.memory.left - 2, y: y})
        spots.push({x: room.memory.right + 2, y: y})
      }
      spots.push({x: room.memory.left - 4, y: y})
      spots.push({x: room.memory.right + 4, y: y})
    }
    let finalSpots = []
    _.each(spots, s => {
      if(s.x < 2) s.x = 2
      if(s.x > 47) s.x = 47
      if(s.y < 2) s.y = 2
      if(s.y > 47) s.y = 47
      finalSpots.push(s)
    })
    Storage.write(room.name + '-wall-spots', finalSpots)
    //RoomBuilder.addRamps(room.name)
    //RoomBuilder.pruneWalls(room.name)
    return true
  }

  static pruneWalls(roomName) {
    let room = Game.rooms[roomName]
    let spots = Storage.read(room.name + '-wall-spots', [])
    let prune = []
    //Log.error(exitTop)
    spots = _.uniq(spots, s => {
      return "x" + s.x + "y" + s.y
    })

    _.each(spots, s => {
         // is there a natural wall here
        if(_.filter(room.lookForAt(LOOK_TERRAIN, s.x, s.y), t => { return t === 'wall' }).length > 0) {
          Log.error(['Natural Wall at', s.x, s.y])
          prune.push({ 'x': s.x, 'y': s.y})
        }
    })

    _.each(prune, p => {
      _.remove(spots, s=> { return s.x === p.x && s.y === p.y })
    })

    Storage.write(room.name + '-wall-spots', spots)
    return true
  }
  static removeWallSpot(roomName, x, y) {
    let room = Game.rooms[roomName]
    let spots = Storage.read(room.name + '-wall-spots', [])
    _.remove(spots, s=> { return s.x === x && s.y === y })
    Storage.write(room.name + '-wall-spots', spots)


  }


  static addRamps(roomName) {
    let room = Game.rooms[roomName]
    let spots = Storage.read(room.name + '-wall-spots', [])
    if(spots.length === 0) return false
    let ramps = []
    let exitTop = room.controller.pos.findClosestByPath(FIND_EXIT_TOP)
    let exitBottom = room.controller.pos.findClosestByPath(FIND_EXIT_BOTTOM)
    let exitRight = room.controller.pos.findClosestByPath(FIND_EXIT_RIGHT)
    let exitLeft = room.controller.pos.findClosestByPath(FIND_EXIT_LEFT)
    let pathLeft = []
    let pathRight = []
    let pathTop = []
    let pathBottom = []
    if(exitLeft)   pathLeft = room.findPath(room.controller.pos, exitLeft, {ignoreDestructibleStructures: true, ignoreCreeps: true})
    if(exitRight)  pathRight = room.findPath(room.controller.pos, exitRight, {ignoreDestructibleStructures: true, ignoreCreeps: true})
    if(exitTop)    pathTop = room.findPath(room.controller.pos, exitTop, {ignoreDestructibleStructures: true, ignoreCreeps: true})
    if(exitBottom) pathBottom = room.findPath(room.controller.pos, exitBottom, {ignoreDestructibleStructures: true, ignoreCreeps: true})
    let paths = pathLeft.concat(pathRight, pathTop, pathBottom)
    _.each(paths, p => {
      room.visual.rect(p.x - 0.5, p.y - 0.5, 1, 1, { fill: Config.colors.red })
      let removed = _.remove(spots, s => { return s.x === p.x && s.y === p.y })
      if(removed.length > 0) ramps.push(removed[0])
    })
    Storage.write(room.name + '-ramp-spots', ramps)
    Storage.write(room.name + '-wall-spots', spots)
    return true
  }

  static clearBuiltWalls(roomName) {
    let room = Game.rooms[roomName]
    _.each(Finder.findWalls(roomName), w => {
      w.destroy()
    })
  }
  static clearBuiltRamps(roomName) {
    let room = Game.rooms[roomName]
    _.each(Finder.findMyRamps(roomName), r => {
      w.destroy()
    })
  }
  static addConstructionSite(roomName, mem, structure) {
    Log.error(['Adding Construction to', roomName])
    let spots = Storage.read(roomName + '-' + mem, [])
    if(spots.length === 0) {
      return true
    }
    let room = Game.rooms[roomName]
    _.some(spots, s => {
      if(room.lookForAt(LOOK_STRUCTURES, s.x, s.y).length == 0) {
        Log.error(['Trying at', s.x, s.y], roomName)
        return room.createConstructionSite(s.x, s.y, structure) ===  OK

      } else {
        return false
      }
    })
    return true
  }
}

/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-18 13:17:52
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-28 06:08:40
*/

'use strict';
class Scalar {
  static bounder(collection, method, biggest = true) {
    let smallest = Number.MAX_SAFE_INTEGER
    let largest = Number.MIN_SAFE_INTEGER
    let smallValue = null
    let largeValue = null
    _.each(collection, i => {
      if(!_.isUndefined(i)) {
        let value = eval('i.' + method) //i.apply(method)
        if(value < smallest) {
          smallest = value
          smallValue = i
        }
        if(value > largest) {
          largest = value
          largeValue = i
        }
      }
    })
    if(biggest) return largeValue
    return smallValue
  }
  static smallest(collection, method) {
    return Scalar.bounder(collection, method, false)
  }
  static largest(collection, method) {
    return Scalar.bounder(collection, method, true)
  }
  static inBounds(pos, roomName) {
    let room = Game.rooms[roomName]
    if(RoomBuilder.needMainArea(roomName)) return true
    return pos.x > room.memory.left && pos.x < room.memory.right && pos.y > room.memory.top && pos.y < room.memory.bottom
  }
  static orderByPos(pos, collection) {
    return _.sortBy(collection, o => {
      return pos.getRangeTo(o.x, o.y)
    })
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:54:40
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-03 18:55:24
*/

'use strict';
Source.prototype.creepCount = function() {
  return Finder.findCreepsWithTarget(this).length
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-15 08:49:10
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-06-28 22:38:20
*/

'use strict';

class Storage {
  static write(key, value) {
    if(!Memory.globals) Memory.globals = {}
    Memory.globals[key] = value
    return value
  }
  static read(key, defaultValue) {
    if(!Memory.globals) Memory.globals = {}
    if(Memory.globals[key] === null) return defaultValue
    return Memory.globals[key]
  }
  static readStat(key, defaultValue) {
    if(_.isUndefined(STATS)) STATS = {}
    if(_.isUndefined(STATS[key])) STATS[key] = defaultValue
    return STATS[key]
  }
  static writeStat(key, value) {
    if(_.isUndefined(STATS)) STATS = {}
    STATS[key] = value
    return value
  }
  static addStat(key, amount = 1) {
    Storage.writeStat(key, Storage.readStat(key, 0) + amount)
    return Storage.readStat(key, amount)
  }
  static clearStat(key) {
    return delete STATS[key]
  }

}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:48:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-21 23:07:07
*/

'use strict';

class Targeting {
  static findOpenSourceSpot(roomName) {
    let sources = Finder.findSources(roomName)
    let result = null
    let least = 9000
    _.each(sources, s => { if(s.creepCount() <= least){
      let spots = Finder.findSpotsAroundTarget(s.id).length
      if(s.creepCount() < spots){
        least = s.creepCount();
        result = s
      }
    }})
    return result
  }
  static findExclusiveEnergy(roomName) {
    let energies = Finder.findEnergy(roomName)
    // Log.warn(energies.length)
    let result = Scalar.largest(energies, 'energyAmount()')
    /*let biggest = 0
    let result = null
    let most = 99999
     (_.each(energies, e =>{
      if(e && e.id && Finder.findCreepsWithTarget(e.id).length <= 1) {
        most = Finder.findCreepsWithTarget(e.id).length
        if(e.store && e.store[RESOURCE_ENERGY] > biggest) {
          biggest = e.store[RESOURCE_ENERGY]
          result = e
        }
        if(e.amount > biggest) {
          biggest = e.amount
          result = e
        }
        if(e.isFull && e.isFull()) {
          result = e
        }
      }
    })*/
    return result
  }
  static findNearestTarget(pos) {
    return pos.findClosestByRange(FIND_HOSTILE_CREEPS)
  }
  static findClosestEnergyStoreInNeed(pos) {
    let storages = Finder.findEnergyStoreInNeed(pos.roomName)
    return pos.findClosestByRange(storages)
  }
  static findCloseEmptyExtension(pos) {
    let extensions = _.filter(pos.findInRange(FIND_STRUCTURES, 1), s => {return s.structureType == STRUCTURE_EXTENSION})
    if(extensions.length > 0) return extensions[0]
  }
  static findAttackTarget(pos) {
    let room = Game.rooms[pos.roomName]
    let creep = Targeting.findNearestTarget(pos)
    if(!_.isNull(creep)) return creep
    let towers = _.filter(Finder.findObjects(pos.roomName, FIND_STRUCTURES), s => { return s.structureType === STRUCTURE_TOWER && s.my === false })
    if(towers.length > 0) return pos.findClosestByRange(towers)
    let spawns = _.filter(Finder.findObjects(pos.roomName, FIND_STRUCTURES), s => { return s.structureType === STRUCTURE_SPAWN && s.my === false })
    if(spawns.length > 0) return pos.findClosestByRange(spawns)
    return pos.findClosestByRange(_.filter(Finder.findObjects(pos.roomName, FIND_HOSTILE_STRUCTURES), s => { return s.structureType != STRUCTURE_CONTROLLER }))

  }
  static findRepairTarget(pos) {
    let room = Game.rooms[pos.roomName]
    let targets = _.filter(Finder.findObjects(pos.roomName, FIND_STRUCTURES), s => { return s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART})
    Log.error(targets.length)
    return pos.findClosestByRange(targets)
  }
  static findWeakestWall(pos) {
    let room = Game.rooms[pos.roomName]
    let targets = _.filter(Finder.findObjects(pos.roomName, FIND_STRUCTURES), s => { return s.hits < s.hitsMax && (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART)})
    return(Scalar.smallest(targets, 'hits'))
  }
  static getRally(creep, color=COLOR_PURPLE) {
    let rally = _.filter(Game.flags, f => {return f.color === color && f.room.name == creep.room.name})
    if(rally.length > 0) {
      return rally[0]
    } else  if(creep.room.controller){
      return creep.room.controller
    } else {
      return new RoomPosition(25, 25, creep.room.name)
    }
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-15 07:54:37
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-01-15 09:46:10
*/

'use strict';

class Time {
  constructor() {
    this.tickTime = 0
    this.samples = Storage.read('timeSamples', 0)
    this.offset = Config.l10n.timezoneOffset
    this.now = new Date()
    this.gameTime = Game.time
    this.compaireTimes()
  }
  currentTime() {
    return this.now
  }
  currentTimeString() {
    return Formatter.localTimeString(this.now)
  }
  gameTime() {
    return this.gameTime
  }
  averageTickTime(){
    return this.tickTime / 1000
  }
  compaireTimes(){
    let previousTick = Storage.read('lastTick', this.GameTime)
    let previousTime = Storage.read('lastTime', this.now)
    let ticks =  this.gameTime - previousTick
    let msecs = this.now.getTime() - new Date(previousTime).getTime()
    this.tickTime = this.calculateAverageTicks( msecs/ticks )
    this.storeTickAvrages()
    Storage.write('lastTick', this.gameTime)
    Storage.write('lastTime', this.now)
  }
  calculateAverageTicks(tickT){
    if(this.samples > 100) {
      this.samples = 0
      return tickT
    } else {
      return ((this.samples * Storage.read('averageTickTime', 0)) + tickT) / (this.samples + 1)
    }
  }
  storeTickAvrages() {
      Storage.write('timeSamples', this.samples + 1)
      Storage.write('averageTickTime', this.tickTime)
  }
  timeTillTick(tick){
    return (tick - this.gameTime) * this.tickTime
  }
  timeAtTick(tick) {
    return new Date(this.now.getTime() + this.timeTillTick(tick))
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-03-06 21:01:32
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-09 10:00:33
*/

'use strict';


class Visualizer {
  static showSquares(roomName, positions, color) {
    let room = Game.rooms[roomName]
    _.each(positions, s => {
      room.visual.rect(s.x - 0.5, s.y - 0.5, 1, 1, { fill: color })
    })
  }
  static showCircles(roomName, positions, color, count = false) {
    let room = Game.rooms[roomName]
    let i = 0
    _.each(positions, p => {
      i++
      room.visual.circle(p.x, p.y, { fill: color })
      if(count) room.visual.text(i, p.x, p.y, {color: Config.colors.green, font: 0.25 })
    })
  }
  static target(targit){
    targit.room.visual.circle(targit.pos.x, targit.pos.y, { fill: Config.colors.red})
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-05-22 21:10:51
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-05-23 15:05:10
*/

'use strict';
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-03-28 06:04:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-28 06:06:03
*/

'use strict';


Resource.prototype.energyAmount = function() {
  if(this.resourceType === RESOURCE_ENERGY) return this.amount
  return 0
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-05 10:44:55
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-28 05:59:09
*/

'use strict';

StructureContainer.prototype.hasRoom = function() {
  return this.store[RESOURCE_ENERGY] < this.energyCapacity
}
StructureContainer.prototype.isFull = function() {
  return !this.hasRoom()
}
StructureContainer.prototype.critical = function() {
  return this.store[RESOURCE_ENERGY] < this.storeCapacity * 0.25
}
StructureContainer.prototype.energyAmount = function() {
  return this.store[RESOURCE_ENERGY]
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-29 19:38:13
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-09 03:02:56
*/

'use strict';

StructureController.prototype.safeModeTill = function() {
  if(this.safeMode) {
    let color = Config.colors.blue
    if (this.safeMode < 500)  color = Config.colors.red
    if (this.safeMode < 2000) color = Config.colors.yellow
    let time = new Time()
    return Formatter.color(color, Formatter.localTimeString(time.timeAtTick(time.gameTime + this.safeMode)))
  }
  return "Not in Safe Mode"
}

StructureController.prototype.tick = function() {
  this.displayNextLevelTimer()
  if(this.safeMode) Log.print(["Safe Mode Until", this.safeModeTill()], this.room.name)
}

StructureController.prototype.displayNextLevelTimer = function() {
  let dierction = 'downgrade'

}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-05 10:44:55
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-05 10:45:02
*/

'use strict';

StructureExtension.prototype.hasRoom = function() {
  return this.energy < this.energyCapacity
}
StructureExtension.prototype.isFull = function() {
  return !this.hasRoom()
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-02 22:42:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-21 22:53:22
*/

'use strict';
StructureSpawn.prototype.type = STRUCTURE_SPAWN
StructureSpawn.prototype.tick = function(kernel) {
  let state = 'idle'
  if(this.spawning) state = 'spawning'
  kernel.register(this, state)
}
StructureSpawn.prototype.canSpawn = function(body) {
  return this.canCreateCreep(body) === OK
}

StructureSpawn.prototype.spawnACreep = function(task) {
  let body = []
  if(task === 'recovery') {
    body = Config.bodies.recovery
  } else {
    body = this.getBody(task)
  }
  if(!body) {
    body = Config.bodies.default
    Log.warn(["Using default body for", task, "for energy level", this.room.energyCapacityAvailable])
  }
  if(this.canSpawn(body)) {
    let id = Counter.number()
    this.createCreep(body, id, {task: task, home: this.room.name})
  } else {
    Log.error(["Can't build", task, 'creep:', this.room.energyAvailable,"of", this.room.energyCapacityAvailable], this.room.name)
  }
}
StructureSpawn.prototype.spawnAClaimCreep = function() {
  let body = Config.bodies['claim']
  if(this.canSpawn(body)) {
    let id = Counter.number()
    this.createCreep(body, id, {task: 'claimer', home: this.room.name, target: this.room.memory.claim})
    delete this.room.memory.claim
  }
}
StructureSpawn.prototype.spawnARemoteCreep = function(task, target) {
  let body = []
  body = this.getBody(task)
  if(!body) {
    Log.error(["No body for", task, "for energy level", this.room.energyCapacityAvailable])
    return false
  }
  Log.info(10)
  if(this.canSpawn(body)) {
    let id = Counter.number()
    this.createCreep(body, id, {task: task, home: this.room.name, targetRoom: target})
  } else {
    Log.error(["Can't build", task, 'creep.', this.room.energyAvailable,"of", this.room.energyCapacityAvailable], this.room.name)
  }
}
StructureSpawn.prototype.getBody = function(task) {
  let body = false
  let e = this.room.energyCapacityAvailable

  while(e >= 300 && !body) {
    try {
      body = Config.bodies[task][e]
    } catch(e) {
      Log.error("Could not fetch top level for", task)
    }
    e = e - 50
  }
  return body
}
/*StructureSpawn.prototype.startSpawn = function(body, targetRoom, task) {
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
}*/
/*StructureSpawn.prototype.spawn = function() {
  let body = Config.bodies[this.room.energyCapacityAvailable]
  let task = "idle"
  if(Finder.findCreeps(this.room.name).length < 4 || Finder.findCreepsWithTask(this.room.name, 'haul').length < 2)
  {
    body = Config.bodies.default
    task = "haul"
  }*/
  //if(Finder.findCreeps(this.room.name).length < 4) body = Config.bodies.default
 /* if(_.isNull(body)) {
    body = Config.bodies.default
    if(this.room.energyCapacityAvailable >= 1800) body = Config.bodies[1800]
    Log.warn(["Having to use default body, Config.bodies is missing an entry for", this.room.energyCapacityAvailable])
  }
  return this.startSpawn(body, this.room.name, task)
}*/
/*StructureSpawn.prototype.spawnClaim = function(roomName) {
  let body = Config.bodies['claim']
  return this.startSpawn(body, roomName, 'claim')
}*/

/*StructureSpawn.prototype.spawnRemoteBuild = function(roomName) {
  let body = Config.bodies[this.room.energyCapacityAvailable]
  return this.startSpawn(body, roomName, 'remote_build')
  return true
}*/
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
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-05 10:44:55
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-28 05:58:15
*/

'use strict';

StructureStorage.prototype.hasRoom = function() {
  return this.store[RESOURCE_ENERGY] < this.energyCapacity
}
StructureStorage.prototype.isFull = function() {
  return !this.hasRoom()
}
StructureStorage.prototype.critical = function() {
  return this.store[RESOURCE_ENERGY] < this.storeCapacity * 0.25
}
StructureStorage.prototype.energyAmount = function() {
  return this.store[RESOURCE_ENERGY]
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-07 18:01:40
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-17 02:30:31
*/

'use strict';

StructureTower.prototype.hasRoom = function() {
  return this.energy < this.energyCapacity
}
StructureTower.prototype.isFull = function() {
  return !this.hasRoom()
}
StructureTower.prototype.critical = function() {
  return this.energy < Config.tower.criticalEnergy
}
StructureTower.prototype.danger = function() {
  return this.energy < Config.tower.dangerEnergy
}


StructureTower.prototype.tower = function(){
  this.doAttack() || this.doRepair() || this.doHeal()
}

StructureTower.prototype.doAttack = function() {
  let target = Targeting.findNearestTarget(this.pos)
  if(target){//} && target.pos.inRangeTo(this, 10)) {
    Log.warn('attacking')
    this.attack(target)
    return true
  }
  return false
}
StructureTower.prototype.doHeal = function() {
  let target = Scalar.smallest(_.filter(Game.creeps, c => c.room.name === this.room.name && c.hits < c.hitsMax), 'hits')
  if(target && target.hits < target.hitsMax * 0.50) {
    this.heal(target)
    return true
  }
  return false
}
StructureTower.prototype.doRepair = function() {
  if(this.danger()) return false
  let needsRepair = _.filter(Finder.findObjects(this.room.name, FIND_STRUCTURES), s => {
    if(s.structureType === STRUCTURE_WALL) return s.hits < Config.tower.walls[this.room.controller.level]
    if(s.structureType === STRUCTURE_RAMPART) return s.hits < Config.tower.walls[this.room.controller.level]
    if(s.hits < (s.hitsMax * 0.01)) return true
    return s.hits < (s.hitsMax / Config.tower.repairPercent) && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART
  })
  let most = 0
  let target = null
  target = _.min(needsRepair, 'hits')
  /*_.each(needsRepair, s => {

      if((s.hitsMax - s.hits) > most) {
        most = s.hitsMax - s.hits
        target = s
      }

  })*/
  this.repair(target)
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 10:05:37
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-26 14:36:34
*/

'use strict';

var Config = {
  logLevel: 4,
  showOverlay: false,
  showHud: true,
  defaultRange: 1,
  upgradeRange: 2,
  buildRange: 1,
  colors: {
    yellow: '#ffe56d',
    gray: '#777777',
    red: '#f93842',
    blue: '#5d80b2',
    green: '#65fd62',
    purple: '#b99cfb',
    white: '#ffffff'
  },
  fonts: {
    mono: 'Menlo,Monaco,Consolas,"Courier New",monospace',
    sans: 'Helvetica, Arial, sans-serif',
    size: '14px'
  },
  l10n: {
    timeZoneOffset: -300
  },
  upgraders: {
    1: 4,
    2: 4,
    3: 3,
    4: 2,
    5: 2,
    6: 2,
    7: 2,
    8: 2
  },
  builders: {
    1: 1,
    2: 1,
    3: 2,
    4: 2,
    5: 2,
    6: 2,
    7: 2,
    8: 2
  },
  wallers: {
    1: 0,
    2: 0,
    3: 0,
    4: 2,
    5: 2,
    6: 2,
    7: 2,
    8: 2
  },
  bodies: {
    small: {body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK], size: 5},
    tiny: {body: [MOVE, ATTACK], size: -1},
    rapid: {body: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE], size: -1},
    deny: {body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, HEAL, ATTACK, RANGED_ATTACK], size: 5},
    claim: [CLAIM, CLAIM, MOVE, MOVE],
    recovery: [WORK, CARRY, MOVE],
    default: [WORK, CARRY, MOVE],
    miner: {
      300: [WORK, WORK, MOVE],
      350: [WORK, WORK, MOVE],
      400: [WORK, WORK, MOVE],
      450: [WORK, WORK, MOVE],
      500: [WORK, WORK, WORK, MOVE],
      550: [WORK, WORK, WORK, WORK, WORK, MOVE],
      600: [WORK, WORK, WORK, WORK, WORK, MOVE],
      650: [WORK, WORK, WORK, WORK, WORK, MOVE],
      700: [WORK, WORK, WORK, WORK, WORK, MOVE],
      750: [WORK, WORK, WORK, WORK, WORK, MOVE],
      800: [WORK, WORK, WORK, WORK, WORK, MOVE],
      850: [WORK, WORK, WORK, WORK, WORK, MOVE],
      900: [WORK, WORK, WORK, WORK, WORK, MOVE],
      950: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1000: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1050: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1100: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1150: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1200: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1250: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1300: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1350: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1400: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1450: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1500: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1550: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1650: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1700: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1750: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1800: [WORK, WORK, WORK, WORK, WORK, MOVE],

    },
    hauler: {
      300: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
      350: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
      400: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
      450: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
      500: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
      550: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
      600: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      650: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      700: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      750: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
      800: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      850: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      900: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      950: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1000: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1050: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1100: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1150: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1200: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1250: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1300: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1350: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1400: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1450: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1500: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1550: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1600: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1650: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1700: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1750: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1800: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    },
    upgrader: {
      300: [CARRY, CARRY, WORK, MOVE, MOVE],
      350: [CARRY, CARRY, WORK, MOVE, MOVE, MOVE],
      400: [CARRY, CARRY, WORK, MOVE, MOVE, MOVE],
      450: [CARRY, CARRY, WORK, MOVE, MOVE, MOVE],
      500: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      550: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      600: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      650: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      700: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      750: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      800: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      850: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      900: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      950: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1000: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1050: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1100: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1150: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1200: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1250: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1300: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1350: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1400: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1450: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1500: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1550: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1600: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1650: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1700: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1750: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1800: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
    },
    waller: {
      1200: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
      1700: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK,  WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    builder: {
      300: [CARRY, CARRY, WORK, MOVE, MOVE],
      350: [CARRY, CARRY, WORK, MOVE, MOVE],
      400: [CARRY, CARRY, WORK, MOVE, MOVE],
      450: [CARRY, CARRY, WORK, MOVE, MOVE],
      500: [CARRY, CARRY, WORK, MOVE, MOVE],
      550: [CARRY, CARRY, WORK, MOVE, MOVE],
      600: [CARRY, CARRY, WORK, MOVE, MOVE],
      650: [CARRY, CARRY, WORK, MOVE, MOVE],
      700: [CARRY, CARRY, WORK, MOVE, MOVE],
      750: [CARRY, CARRY, WORK, MOVE, MOVE],
      800: [CARRY, CARRY, WORK, MOVE, MOVE],
      850: [CARRY, CARRY, WORK, MOVE, MOVE],
      900: [CARRY, CARRY, WORK, MOVE, MOVE],
      950: [CARRY, CARRY, WORK, MOVE, MOVE],
      1000: [CARRY, CARRY, WORK, MOVE, MOVE],
      1050: [CARRY, CARRY, WORK, MOVE, MOVE],
      1100: [CARRY, CARRY, WORK, MOVE, MOVE],
      1150: [CARRY, CARRY, WORK, MOVE, MOVE],
      1200: [CARRY, CARRY, WORK, MOVE, MOVE],
      1250: [CARRY, CARRY, WORK, MOVE, MOVE],
      1300: [CARRY, CARRY, WORK, MOVE, MOVE],
      1350: [CARRY, CARRY, WORK, MOVE, MOVE],
      1400: [CARRY, CARRY, WORK, MOVE, MOVE],
      1450: [CARRY, CARRY, WORK, MOVE, MOVE],
      1500: [CARRY, CARRY, WORK, MOVE, MOVE],
      1550: [CARRY, CARRY, WORK, MOVE, MOVE],
      1600: [CARRY, CARRY, WORK, MOVE, MOVE],
      1650: [CARRY, CARRY, WORK, MOVE, MOVE],
      1700: [CARRY, CARRY, WORK, MOVE, MOVE],
      1750: [CARRY, CARRY, WORK, MOVE, MOVE],
      1800: [CARRY, CARRY, WORK, MOVE, MOVE],
    },

    "remote-builder": {
      1300: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1350: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1400: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1450: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1500: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1550: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1600: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1650: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1700: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1750: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1800: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    },
    attacker: {
      1300: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1350: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1400: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1450: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1500: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1550: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1600: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1650: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1700: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1750: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1800: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE,MOVE,MOVE,MOVE,MOVE, MOVE,MOVE,MOVE,MOVE,MOVE, MOVE,MOVE,MOVE,MOVE,MOVE]
    },
    bait: {
      1800: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    medic: {
      1800: [MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL]
    },
    dumper: {
      1800: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    swarmer: {
      300: [MOVE, ATTACK]
    },
    dancer: {
      1000: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    guard: {
      1800: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE]
    }
  },
  wallSpacing: 4,
  maxConstructionSites: 10,
  tower: {
    criticalEnergy: 200,
    dangerEnergy: 300,
    repairPercent: 10,
    walls: {
      1: 1,
      2: 1,
      3: 5000,
      4: 10000,
      5: 100000,
      6: 1000000,
      7: 2000000,
      8: 3000000
    }
  },
  minEnergy: {
    1: 25,
    2: 50,
    3: 75,
    4: 200,
    5: 200,
    6: 200,
    7: 250,
    8: 300
  }

}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-29 19:24:01
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-21 22:43:00
*/

'use strict';

Room.prototype.tick = function() {
  global[this.name] = this; // makes it easy
  Storage.write("moveOne" + this.name, true)
}

Room.prototype.assignTask = function(task) {
  let creep = _.first(Finder.findIdleCreeps(this.name))
  if(creep) creep.setTask(task)
}
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
  return creeps.length < Finder.findSources(this.name).length * 2
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
Room.prototype.needWaller = function() {
  let creeps = Finder.findCreepsWithTask(this.name, 'waller')
  if(creeps.length < Config.wallers[this.rcl()]) {
    return true
  }
  return false
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
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 09:43:31
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-08 08:36:07
*/

'use strict';

let STATS = {}
module.exports.loop = function () {
  let kernel = new Kernel()
  _.each(Game.spawns, s => { s.tick(kernel) })
  _.each(Game.creeps, c => { c.tick(kernel) })
  _.each(Game.rooms,  r => { r.tick(kernel) })
  kernel.tick()
  // STATS = {}
  // profiler.wrap(function() {
    /*PathFinder.use(true)
    _.forEach(Game.rooms, function(room, name) {
      if(Game.cpu.bucket < 400) {
        Log.warn(['Building Bucket', Game.cpu.bucket])
        return false
      } else {
        global[name] = room
        if(room.isMine()) {
          if(room.rcl() == 1) {
            _.merge(Room.prototype, RCL1Room.prototype)
            room.subTick()
          } else if(room.rcl() == 2) {
            _.merge(Room.prototype, RCL2Room.prototype)
            room.subTick()
          } else if(room.rcl() == 3) {
            _.merge(Room.prototype, RCL3Room.prototype)
            room.subTick()
          } else if(room.rcl() == 4) {
            _.merge(Room.prototype, RCL4Room.prototype)
            room.subTick()
          }
        } else {
          room.tick()
        }

      }
      if(Config.showOverlay) {
        global.showWalls(room.name)
        global.showRamps(room.name)
        global.showExtensions(room.name)
      }
    })

    hud.addLine('CPU', Game.cpu.getUsed(), Game.cpu.limit, null)
    hud.addLine('Bucket', Game.cpu.bucket, 10000, true)
    hud.addLine('Creeps Processed', Storage.readStat('creep-proc', 0), _.size(Game.creeps), true)
    hud.addLine('Room Processed', Storage.readStat('room-proc', 0), _.size(Game.rooms), true)
    hud.addLine('Move CPU', Storage.readStat('account-cpu-move', 0), Game.cpu.getUsed(), Config.colors.blue)
    hud.addLine('Attack CPU', Storage.readStat('account-cpu-attack', 0), Game.cpu.getUsed(), Config.colors.red)
    hud.addLine('Work CPU', Storage.readStat('account-cpu-work', 0), Game.cpu.getUsed(), Config.colors.yellow)
    */
    /*if(Config.showHud) {
      let hud = new Hud
      hud.display()
    }
    Log.tick()*/
  //})

}
