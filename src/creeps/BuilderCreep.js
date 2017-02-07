/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-06 21:51:56
*/

'use strict';
let BuilderCreep = function() {}
_.merge(BuilderCreep, EnergyCollectingCreep)

BuilderCreep.prototype.superTick = function() {
  if(this.isEmpty()) return this.collectEnergy()
  if(this.hasSome()) return this.buildThings()
}

BuilderCreep.prototype.buildThings = function() {
  if(this.needsTarget()) this.setTarget(_.first(Finder.findConstructionSites(this.room.name)))
  if(this.hasTarget()) this.build(this.target())
  if(this.isEmpty()) this.clearTarget()
}

BuilderCreep.prototype.orignalBuild = Creep.prototype.build
BuilderCreep.prototype.build = function(target) {
  if(this.orignalBuild(this.target()) == ERR_NOT_IN_RANGE) this.moveTo(this.target());
}
