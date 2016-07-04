/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:04:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-04 09:16:47
*/

'use strict';

Creep.prototype.tick = function(){
  Log.debug('Ticking Creep: ' + this.name + " Role: " + this.memory.role + " Mode: " + this.memory.mode);
  if (this.memory.role == 'harvester') {
    this.assignHarvesterTasks()
  } else if (this.memory.role == 'miner') {
    this.assignMinerTasks()
  } else if (this.memory.role == 'carrier') {
    this.assignCarrierTasks()
  } else if (this.memory.role == 'upgrader') {
    this.assignUpgraderTasks()
  } else if (this.memory.role == 'builder') {
    this.assignBuilderTasks()
  }
  if(this.ticksToLive < 200 && this.room.energyAvailable >= (this.room.energyCapacityAvailable * 0.25) && this.memory.mode == 'idle') {
    this.memory.mode = 'recharge'
  }
  this.doWork();
  if (this.memory.mode != 'goto') {
    delete this.memory.goto_x
    delete this.memory.goto_y
    delete this.memory.goto_range
  }
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
    this.memory.mode = 'send'
  } else {
    this.memory.mode = 'idle'
  }
}

Creep.prototype.doRecharge = function() {
  var creep = this;
  Object.keys(this.room.memory.my_spawns).forEach(function(key, index) {
      var spawn = Game.getObjectById(creep.room.memory.my_spawns[key].id);
      if(spawn.energy > 0) {
        spawn.memory.mode == 'recharge'
        if(!creep.pos.inRangeTo(spawn.pos.x, spawn.pos.y, 1)) {
          creep.goto(spawn.pos.x, spawn.pos.y)
        } else {
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
    this.memory.mode = 'idle'
  }
}

Creep.prototype.moveCloseTo = function(x, y, range) {
  if(!range) {
    range = 0
  }
  if(this.pos.inRangeTo(x, y, range)) {
    return true
  } else {
    this.moveTo(x, y)
    return false
  }
}

/*Creep.prototype.goto = function(x, y, range) {
 if(x) {
    this.memory.goto_x = x
  }
  if(y) {
    this.memory.goto_y = y
  }
  if(typeof range != 'undefined') {
    this.memory.goto_range = range
  } else {
    range = this.memory.goto_range
    if(typeof range == 'undefined') {
      range = 1
      this.memory.goto_range = range
    }
  }
  x = this.memory.goto_x
  y = this.memory.goto_y
  if (this.pos.inRangeTo(x, y, range)) { // == this.pos.x && y == this.pos.y)
    if(this.room.memory.sources && this.memory.mode != 'harvester' && this.memory.mode != 'miner') {
      var creep = this
      Object.keys(this.room.memory.sources).some(function(key, index) {
        var position = creep.room.memory.sources[key]
        if(position.x == creep.pos.y && position.y == creep.pos.y) {
          var choices = [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT];
          var choice = choices[Math.floor(Math.random()*choices.length)];
          this.move(choice);
        }
      }, creep.room.memory.sources);
    }

    this.memory.mode = this.memory.before_goto_mode || 'idle'
    delete this.memory.before_goto_mode
    delete this.memory.goto_range
    delete this.memory.goto_x
    delete this.memory.goto_y
  } else {
    if (this.memory.mode == 'goto') {
      if(range == 0) {
        var look = this.room.lookAt(x, y);
        var me = this
        look.forEach(function(lookObject) {
          if(lookObject.type == LOOK_CREEPS) {
            Log.warn("Spot is taken " + me.name + " can't move there: " + x + ", " + y)
            me.memory.mode = "idle"
          }
        });
      }
      this.moveTo(x, y)
    } else {
      this.memory.before_goto_mode = this.memory.mode
      this.memory.mode = 'goto'
    }
  }
}*/
