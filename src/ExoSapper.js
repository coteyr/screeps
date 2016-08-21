/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-21 14:09:18
*/

'use strict';


Creep.prototype.setupExoSapperMemory = function() {
  this.chooseExoTarget('sapper')
}
Creep.prototype.assignTravelExoSapperTasks = Creep.prototype.assignTravelExoHarvesterTasks
Creep.prototype.assignHomeExoSapperTasks = Creep.prototype.assignHomeExoHarvesterTasks
Creep.prototype.assignRemoteExoSapperTasks = function () {
  if(!this.isFull() && (Finder.hasHostals(this.room.name) || this.hits < this.hitsMax)) {
    this.setMode('sap')
  } else {
    this.assignRemoteExoHarvesterTasks()
  }
}

Creep.prototype.doSap = function() {
  var target = Targeting.nearestHostalCreep(this.pos)
  var range = this.pos.getRangeTo(target)
  if(this.hits < (this.hitsMax * 0.75)) range = range - 5  // run away for healing
  if(target) {
    if(range > 2) {
      this.moveTo(target)
      this.heal(this)
      this.rangedMassAttack()
    } else if(range === 2) {
      this.heal(this)
      this.rangedAttack(target)
    } else if(range <= 1) {
      if (this.pos.x > 10 && this.pos.y > 10 && this.pos.x < 40 && this.pos.y < 40) {
        var dir = this.pos.getDirectionTo(target)
        var go = dir + 4
        if (go > 8) go = go - 8
        this.move(go)
      } else {
        this.moveCloseTo(25, 25, 5)
      }
      this.heal(this)
    }
  } else {
    this.normalAttack()
  }
}

