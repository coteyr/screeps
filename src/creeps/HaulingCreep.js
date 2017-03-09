/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-09 10:58:41
*/

'use strict';
let HaulingCreep = function() {}
_.merge(HaulingCreep.prototype, EnergyCollectingCreep.prototype)

HaulingCreep.prototype.superTick = function() {
  this.useEnergy(this.collectEnergy, this.deliverEnergy)
}

HaulingCreep.prototype.orignalTransfer = Creep.prototype.transfer

HaulingCreep.prototype.transfer = function(target) {
  if(this.orignalTransfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) this.goTo(target)
}
HaulingCreep.prototype.deliverEnergy = function() {
  if(this.needsTarget()) this.setTarget(Targeting.findClosestEnergyStoreInNeed(this.pos)) // this.setTarget(Finder.findEnergyStoreInNeed(this.room.name))
  if(this.needsTarget()) return this.setTask('idle')
  if(this.hasTarget()) this.transfer(this.target())
  if(this.target().isFull()) this.clearTarget()
  Log.error(['yyyy', this.isEmpty()])
  if(this.isEmpty()) this.clearTarget()

  // if(this.target() && this.validateTarget([STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_STORAGE, STRUCTURE_CONTAINER] ) && this.target().isFull()) this.clearTarget()
}


