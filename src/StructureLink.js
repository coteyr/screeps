/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-01 19:58:52
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-07 09:15:07
*/

'use strict';



StructureLink.prototype.sender = function() {
  return this.pos.x <= 6 || this.pos.x >= 45 || this.pos.y <= 6 || this.pos.y >= 45
}

StructureLink.prototype.receiver = function() {
  return !this.sender()
}

StructureLink.prototype.isFull = function() {
  return this.energy >= this.energyCapacity
}

StructureLink.prototype.tick = function() {
  if (this.cooldown <= 0 && this.energy > this.energyCapacity / 2) {
    let target = Finder.findReceivingLink(this.room.name)
    if(target) this.transferEnergy(target)
  }
}
