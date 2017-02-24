/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:15
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-21 12:25:25
*/

'use strict';
let MinerCreep = function() {}
MinerCreep.prototype.superTick = function() {
    if(this.hasTarget()) {
      this.harvestTarget();
    } else {
      this.setTarget(Targeting.findOpenSourceSpot(this.room.name))
    }
}
MinerCreep.prototype.harvestTarget = function() {
  this.room.visual.text('\u26CF', this.pos, {color: Config.colors.yellow, size: 0.25})
  let result = this.harvest(this.target())
  if(result === ERR_NOT_IN_RANGE) {
    this.goTo(this.target());
  } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
    this.clearTarget()
  }
  this.drop(RESOURCE_ENERGY)
}

MinerCreep.prototype.orignalHarvest = Creep.prototype.harvest

MinerCreep.prototype.harvest = function(target) {
  let result = this.orignalHarvest(target)
  if(result === OK) {
    if(_.filter(Finder.findConstructionSites(this.room.name), c => { c.structureType === STRUCTURE_CONTAINER }).length > 0) return true
    let worked = false
    _.each(this.room.lookForAt(LOOK_STRUCTURES, this.pos.x, this.pos.y), l => {
      if(l.structueType === STRUCTURE_CONTAINER) worked = true
    })
    if(!worked) this.room.createConstructionSite(this.pos, STRUCTURE_CONTAINER)
  }
  return result
}
