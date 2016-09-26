/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-25 15:49:40
*/

'use strict';


Creep.prototype.setupExoHealerMemory = Creep.prototype.setupExoAttackerMemory
Creep.prototype.assignTravelExoHealerTasks = function() {
  this.assignTravelExoAttackerTasks()
  if (!this.modeIs('transition')) {
  if (this.mode() !== 'heal') {
    var target = this.pos.findClosestByRange(FIND_MY_CREEPS, {
      filter: function(object) {
          return object.hits < object.hitsMax;
      }
    });
    if (target) {
      this.setMode('heal')
    }
  }
  }
}

Creep.prototype.assignHomeExoHealerTasks = Creep.prototype.assignHomeExoAttackerTasks /*function() {
  var target = this.pos.findClosestByRange(FIND_MY_CREEPS, {
    filter: function(object) {
        return object.hits < object.hitsMax;
    }});
    if(target) {
      if(this.heal(target) == ERR_NOT_IN_RANGE) {
          this.moveTo(target);
      }
    }
}*/
Creep.prototype.assignRemoteExoHealerTasks = function() {
  if(this.mode() != 'transition') {
    if (this.hits <= 600) {
      this.setMode('go-home')
    } else {
      this.setMode('heal')
    }
  }
}
Creep.prototype.doHeal = function() {
  if(Game.rooms[this.memory.home].tactic() === 'post') {
    this.postHeal()
  } else {
    this.normalHeal()
  }
}
Creep.prototype.postHeal = function() {
  var flag = this.room.find(FIND_FLAGS)[0]

  if(this.needsTarget()) this.setTarget(Targeting.nearestDamagedFriendly(this.pos, this.room))
  if(this.hasTarget()) {
    let target = this.target()
    this.moveCloseTo(target.pos.x, target.pos.y, 1)
    this.heal(target)
    if(target.hits >= target.hitsMax) this.clearTarget()
  } else {
    if(flag) {
      this.moveCloseTo(flag.pos.x, flag.pos.y, 1)
    } else {
      this.moveCloseTo(25, 25, 10)
    }
  }
}
Creep.prototype.normalHeal = function() {
  var target = this.pos.findClosestByRange(FIND_MY_CREEPS, {
    filter: function(object) {
        return object.hits < object.hitsMax;
    }});
  if(target) {
    if(this.heal(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
    }
  } else {
    this.moveTo(36, 3)
  }
}
