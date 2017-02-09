/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-08 01:52:17
*/

'use strict';
let HaulingCreep = function() {}
_.merge(HaulingCreep.prototype, EnergyCollectingCreep.prototype)

HaulingCreep.prototype.superTick = function() {
  this.useEnergy(this.collectEnergy, this.deliverEnergy)
}

HaulingCreep.prototype.orignalTransfer = Creep.prototype.transfer

HaulingCreep.prototype.transfer = function(target) {
  if(this.orignalTransfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) this.moveTo(target)/*, { reusePath: 10, ignoreCreeps: false, ignoreRoads: true, costCallback: function(roomName, costMatrix) {
      costMatrix.set(16, 16, 50)
      costMatrix.set(19, 14, 50)
    } }) */
}
HaulingCreep.prototype.deliverEnergy = function() {
  if(this.needsTarget()) this.setTarget(Finder.findEnergyStoreInNeed(this.room.name))
  if(this.needsTarget()) return this.setTask('idle')
  if(this.hasTarget()) this.transfer(this.target())
  if(this.isEmpty()) this.clearTarget()
  if(this.target() && this.validateTarget([STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER]) && this.target().isFull()) this.clearTarget()
}


