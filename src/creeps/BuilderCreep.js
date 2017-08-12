/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-07-03 15:58:20
*/

'use strict';
let BuilderCreep = function() {}


BuilderCreep.prototype.builder = function() {
  if(this.needEnergy()) {
    if(this.hasTarget()) {
        this.pickup(this.target())
      } else {
        this.setTarget(Targeting.findExclusiveEnergy(this.room.name))
      }
  } else {
    this.buildThings()
  }
}

BuilderCreep.prototype.buildThings = function() {
  if(this.needsTarget('build')) this.setTarget(_.first(Finder.findConstructionSites(this.room.name)), 'build')
  if(this.hasTarget('build')) this.build(this.target('build'))
}
