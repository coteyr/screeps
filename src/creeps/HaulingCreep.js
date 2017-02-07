/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-06 21:48:05
*/

'use strict';
let HaulingCreep = function() {}
_.merge(HaulingCreep, EnergyCollectingCreep)

HaulingCreep.prototype.superTick = function() {
  if(this.isEmpty()) return this.collectEnergy()
  if(this.hasSome()) return this.deliverEnergy()
}

HaulingCreep.prototype.deliverEnergy = function() {
  if(this.needsTarget()) this.setTarget(Finder.findEnergyStoreInNeed(this.room.name))
  if(this.needsTarget()) return this.setTask('idle')
  if(this.hasTarget()) this.transfer(this.target())
  if(this.isEmpty()) this.clearTarget()
  if(this.target() && this.target().isFull()) this.clearTarget()
}



HaulingCreep.prototype.orignalTransfer = Creep.prototype.transfer



HaulingCreep.prototype.transfer = function(target) {
  if(this.orignalTransfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) this.moveTo(target)
}
