/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:04:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-09 04:00:36
*/

'use strict';

Creep.prototype.tick = function(){
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
  }
  /*if(this.ticksToLive < 200 && this.room.energyAvailable >= (this.room.energyCapacityAvailable * 0.25)) {
    this.setMode('recharge')
  }*/
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
        this.doCross();
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
  if(this.memory.role == 'harvester') {
    this.setMode('send')
  } else {
    this.setMode('idle')
  }
}

Creep.prototype.doTransition = function() {
  if (this.room.name === this.memory.harvest) {
    if(this.move(this.memory.exit_dir) == 0) {
      this.setMode('idle');
    }
  }
}

Creep.prototype.doCross = function() {
  if (this.room.name === this.memory.home) {
    if(this.move(this.memory.exit_dir) == 0) {
      this.setMode('idle');
    }
  }
}


Creep.prototype.doEnter = function() {
  if (this.room.name == this.memory.attack) {
    var choices = [BOTTOM];
    var choice = choices[Math.floor(Math.random()*choices.length)];
    this.move(BOTTOM);
  }
  this.setMode('idle');
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
