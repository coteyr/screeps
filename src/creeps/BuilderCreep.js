/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-27 00:03:56
*/

'use strict';
let BuilderCreep = function() {}
_.merge(BuilderCreep.prototype, EnergyCollectingCreep.prototype)

BuilderCreep.prototype.superTick = function() {
  this.useEnergy(this.collectEnergy, this.buildThings)
}

BuilderCreep.prototype.buildThings = function() {
  if(this.needsTarget()) this.setTarget(_.first(Finder.findConstructionSites(this.room.name)))
  if(this.hasTarget()) this.build(this.target())
  if(this.needsTarget()) this.setTask('idle')
  if(this.isEmpty()) this.clearTarget()
}
