/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-26 06:33:02
*/

'use strict';


Creep.prototype.setupExoResponderMemory = function() {
  this.chooseExoTarget('responder')
}
Creep.prototype.assignTravelExoResponderTasks = function() {
  this.setMode('move-out')
}
Creep.prototype.assignHomeExoResponderTasks = function() {
  this.setMode('move-out')
}
Creep.prototype.assignRemoteExoResponderTasks = function () {
  this.setMode('respond')
}

Creep.prototype.doRespond = function() {
  var critical = this.pos.findClosestByRange(FIND_MY_CREEPS, {
    filter: function(object) {
        return object.hits < object.hitsMax * 0.50;
    }});
  if (critical) {
    if(this.heal(critical) == ERR_NOT_IN_RANGE) {
        this.moveTo(critical);
    }
  } else {
    var target = Targeting.nearestHostalCreep(this.pos)
    if(target) {
      if(this.attack(target) == ERR_NOT_IN_RANGE) {
          this.rangedMassAttack()
          this.moveTo(target);
      }
    } else {
      var patient = this.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: function(object) {
          return object.hits < object.hitsMax;
      }});
      if(patient) {
        if(this.heal(patient) == ERR_NOT_IN_RANGE) {
          this.moveTo(patient);
        }
      } else {
        var flag = this.room.find(FIND_FLAGS)[0]
        if(flag) {
          this.moveCloseTo(flag.pos.x, flag.pos.y, 5)
        }
      }
    }
  }
}
