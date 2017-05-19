/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-27 17:08:00
*/

'use strict';
let RepairCreep = function() {}
_.merge(RepairCreep.prototype, EnergyCollectingCreep.prototype)

RepairCreep.prototype.superTick = function() {
  this.useEnergy(this.collectEnergy, this.repairThings)
  // this.room.visual.text('M', this.pos, {color: Config.colors.yellow, size: 0.25})
}

RepairCreep.prototype.repairThings = function() {
  if(this.needsTarget()) this.setTarget(Targeting.findRepairTarget(this.pos))
  if(this.hasTarget()) this.repair(this.target())
  if(this.hasTarget() && this.target().hits >= this.target().hitsMax) this.clearTarget()
  if(this.needsTarget()) this.setTask('idle')
  // if(this.isEmpty()) this.clearTarget()
}

