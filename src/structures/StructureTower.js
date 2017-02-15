/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-07 18:01:40
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-15 05:22:48
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


StructureTower.prototype.tick = function(){
  this.doAttack() || this.doRepair()

  this.doHeal()
}

StructureTower.prototype.doAttack = function() {
  let target = Targeting.findNearestTarget(this.pos)
  if(target) {
    Log.warn('attacking')
    this.attack(target)
    return true
  }
}
StructureTower.prototype.doHeal = function() {
  return false
}
StructureTower.prototype.doRepair = function() {
  if(this.danger()) return false
  let needsRepair = _.filter(Finder.findObjects(this.room.name, FIND_STRUCTURES), s => {
    if(s.pos.x > s.room.memory.right || s.pos.x < s.room.memory.left || s.pos.y > s.room.memory.bottom || s.pos.y < s.room.memory.top) return false
    if(s.structureType === STRUCTURE_WALL) return s.hits < Config.tower.walls[this.room.controller.level]
    return s.hits < (s.hitsMax / Config.tower.repairPercent)
  })
  let most = 0
  let target = null
  _.each(needsRepair, s => {
    if((s.hitsMax - s.hits) > most) {
      most = s.hitsMax - s.hits
      target = s
    }
  })
  if(target) this.repair(target)
}
