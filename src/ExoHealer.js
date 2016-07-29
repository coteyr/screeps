/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-29 02:07:06
*/

'use strict';


Creep.prototype.setupExoHealerMemory = Creep.prototype.setupExoAttackerMemory
Creep.prototype.assignTravelExoHealerTasks = function() {
  this.assignTravelExoAttackerTasks()
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

Creep.prototype.assignHomeExoHealerTasks = Creep.prototype.assignHomeExoAttackerTasks
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
