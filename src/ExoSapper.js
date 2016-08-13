/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-11 12:10:14
*/

'use strict';


Creep.prototype.setupExoSapperMemory = function() {
  this.chooseExoTarget('sapper')
}
Creep.prototype.assignTravelExoSapperTasks = Creep.prototype.assignTravelExoHarvesterTasks
Creep.prototype.assignHomeExoSapperTasks = Creep.prototype.assignHomeExoHarvesterTasks
Creep.prototype.assignRemoteExoSapperTasks = function () {
  if(Finder.hasHostals(this.room.name) || this.hits < this.hitsMax) {
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
      this.rangedMassAttack()
    } else if(range <= 1) {
      this.moveCloseTo(25, 25, 5)
      this.heal(this)
    }
  } else {
    this.setMode('idle')
  }
}

