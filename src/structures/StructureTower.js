/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-07 18:01:40
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-17 02:30:31
*/

'use strict';

StructureTower.prototype.hasRoom = function() {
  return this.energy < this.energyCapacity
}
StructureTower.prototype.isFull = function() {
  return !this.hasRoom()
}
StructureTower.prototype.critical = function() {
  return this.energy < Config.tower.criticalEnergy
}
StructureTower.prototype.danger = function() {
  return this.energy < Config.tower.dangerEnergy
}


StructureTower.prototype.tower = function(){
  this.doAttack() || this.doRepair() || this.doHeal()
}

StructureTower.prototype.doAttack = function() {
  let target = Targeting.findNearestTarget(this.pos)
  if(target){//} && target.pos.inRangeTo(this, 10)) {
    Log.warn('attacking')
    this.attack(target)
    return true
  }
  return false
}
StructureTower.prototype.doHeal = function() {
  let target = Scalar.smallest(_.filter(Game.creeps, c => c.room.name === this.room.name && c.hits < c.hitsMax), 'hits')
  if(target && target.hits < target.hitsMax * 0.50) {
    this.heal(target)
    return true
  }
  return false
}
StructureTower.prototype.doRepair = function() {
  if(this.danger()) return false
  let needsRepair = _.filter(Finder.findObjects(this.room.name, FIND_STRUCTURES), s => {
    if(s.structureType === STRUCTURE_WALL) return s.hits < Config.tower.walls[this.room.controller.level]
    if(s.structureType === STRUCTURE_RAMPART) return s.hits < Config.tower.walls[this.room.controller.level]
    if(s.hits < (s.hitsMax * 0.01)) return true
    return s.hits < (s.hitsMax / Config.tower.repairPercent) && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART
  })
  let most = 0
  let target = null
  target = _.min(needsRepair, 'hits')
  /*_.each(needsRepair, s => {

      if((s.hitsMax - s.hits) > most) {
        most = s.hitsMax - s.hits
        target = s
      }

  })*/
  this.repair(target)
}
