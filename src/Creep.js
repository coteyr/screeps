/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:04:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-11 23:34:58
*/

'use strict';

Creep.prototype.tick = function(){
  if(!this.memory.mode) {
    this.setMode('idle')
  }
  Log.debug('Ticking Creep: ' + this.name + " Role: " + this.memory.role + " Mode: " + this.memory.mode);
  if (this.memory.role === 'harvester') {
    this.assignHarvesterTasks()
  } else if (this.memory.role === 'miner') {
    this.assignMinerTasks()
  } else if (this.memory.role === 'carrier') {
    this.assignCarrierTasks()
  } else if (this.memory.role === 'upgrader') {
    this.assignUpgraderTasks()
  } else if (this.memory.role === 'builder') {
    this.assignBuilderTasks()
  } else if (this.memory.role === 'exo-harvester') {
    this.assignExoHarvesterTasks()
  } else if (this.memory.role === 'exo-attacker') {
    this.assignExoAttackerTasks()
  } else if (this.memory.role === 'exo-reserver') {
    this.assignExoReserverTasks()
  } else if (this.memory.role === 'exo-cliamer') {
    this.assignExoClaimerTasks()
  } else if (this.memory.role === 'exo-builder') {
    this.assignExoBuilderTasks()
  }
  /*if(this.ticksToLive < 200 && this.room.energyAvailable >= (this.room.energyCapacityAvailable * 0.25)) {
    this.setMode('recharge')
  }*/
  if(this.ticksToLive < 200 && (this.room.name === this.memory.home || !this.memory.home) && _.size(this.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}})) > 0) {
    this.memory.mode = 'recycle'
  }
  this.doWork();
}

Creep.prototype.doWork = function() {
  try { // isolate the issue from other creeps
    switch(this.memory.mode) {
      case 'goto':
        this.moveCloseTo();
        break;
      case 'mine':
        this.doMine()
        break;
      case 'store':
        this.doStore()
        break;
      case 'recharge':
        this.doRecharge()
        break;
      case 'send':
        this.doSend()
        break;
      case 'broadcast':
        this.doSend()
        break;
      case 'noop':
        this.doNoop()
        break;
      case 'pickup':
        this.doPickup()
        break;
      case 'fill':
        this.doFill()
        break;
      case 'transfer':
        this.doTransfer()
        break;
      case 'upgrade':
        this.doUpgrade()
        break;
      case 'wait-energy':
        this.doWaitEnergy()
        break;
      case 'build':
        this.doBuild();
        break;
      case 'leave':
        this.doLeave();
        break;
      case 'transition':
        this.doTransition();
        break;
      case 'cross':
        this.doTransition();
        break;
      case 'go-home':
        this.doGoHome()
        break;
      case 'rally':
        this.doRally()
        break;
      case 'move-out':
        this.doMoveOut()
        break;
      case 'enter':
        this.doEnter()
        break;
      case 'attack':
        this.doAttack()
        break;
      case 'recycle':
        this.doRecycle()
        break;
      case 'exop':
        this.doExOp()
        break;
      case 'reserve':
        this.doReserve()
        break;
      case 'claim':
        this.doClaim()
        break;
      case 'exop-build':
        this.doExOpBuild()
        break;
    }

  } catch(error) {
    Log.error(this.name + " HAS AN ERROR")
    Log.error(error.message)
    Log.error("Role: " + this.memory.role + " Mode: " + this.memory.mode)
    this.room.resetMemory();
  }
}

Creep.prototype.doNoop = function() {
  var choices = [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT];
  var choice = choices[Math.floor(Math.random()*choices.length)];
  this.move(choice);
  Log.warn(this.name + " has nothing to do. Wiggle!")
  if(this.memory.role === 'harvester') {
    this.setMode('send')
  } else {
    this.setMode('idle')
  }
}

Creep.prototype.doTransition = function() {
  var roomName = this.memory.goto_room
  if (this.room.name === roomName) {
    if(this.move(this.memory.exit_dir) === 0) {
      this.setMode('idle');
      delete this.memory.exit_dir
      delete this.memory.exit
      delete this.memory.goto_room
    }
  }
}






Creep.prototype.doRecharge = function() {
  var creep = this;
  Object.keys(this.room.memory.my_spawns).forEach(function(key, index) {
      var spawn = Game.getObjectById(creep.room.memory.my_spawns[key].id);
      if(spawn.energy > 0) {
        spawn.memory.mode === 'recharge'
        if(creep.moveCloseTo(spawn.pos.x, spawn.pos.y, 1)) {
          creep.transfer(spawn, RESOURCE_ENERGY)
          spawn.renewCreep(creep)
          if(creep.ticksToLive >= 1400) {
            creep.memory.mode = 'idle'
            spawn.memory.mode = 'idle'
          }
        }
      }
    }, this.memory.my_spawns);
  if (this.room.energyAvailable <= 100) {
    this.setMode('idle')
  }
}

Creep.prototype.moveCloseTo = function(x, y, range) {
  if(!range) {
    range = 0
  }
  var distance = this.pos.getRangeTo(x, y)
  if(this.pos.inRangeTo(x, y, range)) {
    return true
  } else {
    this.moveTo(x, y, {reusePath: distance})
    return false
  }
}

Creep.prototype.doRecycle = function() {
  var me = this;
  var spots = _.filter(this.room.memory.my_containers, function(object) {
      var structure = Game.getObjectById(object.id)
      // Log.info(JSON.stringify(structure))
      return structure.storedEnergy() < structure.possibleEnergy() - me.carry.energy;
  })
  if (_.size(spots) >= 1) {
    if (this.moveCloseTo(spots[0].pos.x, spots[0].pos.y , 0)) {
       this.suicide()
    }
  } else {
    Log.warn(this.name + " has no where to die. Idling")
    this.setMode('idle')
  }
}

Creep.prototype.recycle = function() {
  this.setMode('recycle')
}

