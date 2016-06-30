/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:04:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-30 14:59:22
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
  if(this.ticksToLive < 200 && this.room.energyAvailable >= this.room.energyCapacityAvailable && this.memory.mode == 'idle') {
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
  if(this.memory.mode == "goto") {
    this.goto();
  } else if(this.memory.mode == 'mine') {
    this.doMine();
  } else if(this.memory.mode == 'store') {
    this.doStore();
  } else if(this.memory.mode == 'recharge') {
    this.doRecharge();
  } else if(this.memory.mode == 'send') {
    this.doSend();
  } else if(this.memory.mode == 'noop') {
    this.doNoop();
  } else if(this.memory.mode == 'pickup') {
    this.doPickup();
  } else if(this.memory.mode == 'fill') {
    this.doFill();
  } else if(this.memory.mode == 'transfer') {
    this.doTransfer();
  } else if(this.memory.mode == 'upgrade') {
    this.doUpgrade();
  } else if(this.memory.mode == 'wait-energy') {
    this.doWaitEnergy();
  } else if(this.memory.mode == 'build') {
    this.doBuild();
  }
  } catch(error) {
    Log.error(this.name + " HAS AN ERROR")
    Log.error(error.message)
    Log.error("Role: " + this.memory.role + " Mode: " + this.memory.mode)
    var caller_line = error.stack.split("\n")[4];
    var index = caller_line.indexOf("at ");
    var clean = caller_line.slice(index+2, caller_line.length);
    Log.error(error.stack)
    Log.error(index)
    Log.error(clean)
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

Creep.prototype.goto = function(x, y, range) {
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
    this.memory.mode = this.memory.before_goto_mode || 'idle'
    delete this.memory.before_goto_mode
    delete this.memory.goto_range
    delete this.memory.goto_x
    delete this.memory.goto_y
  } else {
    if (this.memory.mode == 'goto') {
      Log.debug("Trying to move: " + this.moveTo(x, y))
    } else {
      this.memory.before_goto_mode = this.memory.mode
      this.memory.mode = 'goto'
    }
  }
}
