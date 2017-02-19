/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-06 21:45:14
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-16 04:04:23
*/

'use strict';

let EnergyCollectingCreep = function() {}

EnergyCollectingCreep.prototype.orignalPickup = Creep.prototype.pickup

EnergyCollectingCreep.prototype.pickup = function(target) {
  let result = null
  if(target.structureType == STRUCTURE_CONTAINER) result = this.withdraw(target, RESOURCE_ENERGY)
  if(target.resourceType == RESOURCE_ENERGY) result = this.orignalPickup(target)
  if( result === ERR_NOT_IN_RANGE) this.goTo(target)
  if( result === ERR_INVALID_TARGET) this.clearTarget()
  if( result === OK ) this.clearTarget()
}

EnergyCollectingCreep.prototype.collectEnergy = function() {
  Log.info('Collect')
  if(this.needsTarget()) this.setTarget(Targeting.findExclusiveEnergy(this.room.name))
  if(this.hasTarget()) this.pickup(this.target())
  if(this.needsTarget()) this.setTask('idle')
  if(this.hasSome()) this.clearTarget()
}

EnergyCollectingCreep.prototype.useEnergy = function (collectMethod, useMethod)  {
  if(this.isEmpty()) return collectMethod.apply(this, null)
  if(this.hasSome()) return useMethod.apply(this, null)
}
