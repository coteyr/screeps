/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-06 21:45:14
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-04-03 23:16:16
*/

'use strict';

let EnergyCollectingCreep = function() {}

EnergyCollectingCreep.prototype.orignalPickup = Creep.prototype.pickup

EnergyCollectingCreep.prototype.pickup = function(target) {
  let result = null
  if(target.structureType == STRUCTURE_CONTAINER || target.structureType == STRUCTURE_STORAGE) {
    result = this.work(this.withdraw, target, Config.defaultRange, [RESOURCE_ENERGY])
  }
  if(target.resourceType == RESOURCE_ENERGY) {
    result  = this.work(this.orignalPickup, target, Config.defaultRange)
  }
  Log.error(result, this.name)
  if( result === ERR_NOT_IN_RANGE) Log.warn('Not In Range', this.name) //this.goTo(target)
  if( result === ERR_INVALID_TARGET) Log.warn('Not Valid Target') //this.clearTarget()
  if( result === OK ) this.clearTarget()
}

EnergyCollectingCreep.prototype.collectEnergy = function() {
  CpuAccounting.accountFor('work', () => {
    if(this.hasTarget() && !this.validateTarget([STRUCTURE_CONTAINER, RESOURCE_ENERGY, STRUCTURE_STORAGE])) this.clearTarget()
    if(this.needsTarget()) this.setTarget(Targeting.findExclusiveEnergy(this.room.name))
    if(this.hasTarget()) this.pickup(this.target())
    if(this.needsTarget()) this.setTask('idle')
    if(this.hasSome()) this.clearTarget()
  })

  //if(this.target() && this.validateTarget([STRUCTURE_CONTAINER, RESOURCE_ENERGY] ) && this.target().isFull()) this.clearTarget()
}

EnergyCollectingCreep.prototype.useEnergy = function (collectMethod, useMethod)  {
  if(this.isEmpty()) {
    this.memory.mode = 'collect'
    return collectMethod.apply(this, null)
  } else {
    this.memory.mode = 'use'
    return useMethod.apply(this, null)
  }
}
