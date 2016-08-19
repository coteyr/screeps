/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-15 00:10:00
*/

'use strict';


Creep.prototype.setupExoDemoMemory = Creep.prototype.setupExoAttackerMemory
Creep.prototype.assignTravelExoDemoTasks =Creep.prototype.assignTravelExoAttackerTasks
Creep.prototype.assignHomeExoDemoTasks = Creep.prototype.assignHomeExoAttackerTasks
Creep.prototype.assignRemoteExoDemoTasks = function () {
  if(this.mode() !== 'transition') {
    if (this.mode() != 'go-home') {
      this.setMode('destroy')
    }
    if (this.hits <= 500) {
      this.setMode('go-home')
    }
  }

}

Creep.prototype.doDestroy = function() {
  if(this.needsTarget()) {
    this.setTarget(Targeting.nearByStructures(this.pos))
  }
  if(this.hasTarget()) {
    var target = this.target()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) {
      this.dismantle(target)
      this.rangedMassAttack()
    } else {
      this.rangedMassAttack()
    }
  } else {
    var bad = Targeting.nearestHostalSpawn(this.pos)
    this.moveCloseTo(bad.pos.x, bad.pos.y, 1)
  }
}
