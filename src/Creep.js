/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:04:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-28 15:31:34
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
  }
  this.doWork();
  if (this.memory.mode != 'goto') {
    delete this.memory.goto_x
    delete this.memory.goto_y
    delete this.memory.goto_range
  }
}

Creep.prototype.doWork = function() {
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
  }
}

Creep.prototype.doNoop = function() {
  var choices = [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT];
  var choice = choices[Math.floor(Math.random()*choices.length)];
  this.move(choice);
  Log.warn(this.name + " has nothing to do. Wiggle!")
  this.memory.mode = 'idle'
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