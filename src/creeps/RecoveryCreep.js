/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-06-29 21:13:13
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-07-03 15:14:41
*/

'use strict';
let RecoveryCreep = function() {}
RecoveryCreep.prototype.recover = function() {
  if(this.isEmpty()) {
    this.memory.status = 'fill'

  }
  if(this.isFull()) {
    this.memory.status = 'empty'
    this.clearTarget()
  }
  if(this.memory.status === 'fill') {
    if(this.hasTarget()) {
        this.harvest(this.target())
      } else {
        this.setTarget(Targeting.findOpenSourceSpot(this.room.name))
      }
  } else {
    if(this.room.isFull()) {
      this.upgradeController()
    } else {
      if(this.needsTarget('drop')) this.setTarget(Targeting.findClosestEnergyStoreInNeed(this.pos), 'drop') // this.setTarget(Finder.findEnergyStoreInNeed(this.room.name))
      if(this.hasTarget('drop')) {
        this.transfer(this.target('drop'))
        if(this.target('drop').isFull()) this.clearTarget('drop')
      }
      if(this.isEmpty()) this.clearTarget('drop')

  // if(this.target() && this.validateTarget([STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_STORAGE, STRUCTURE_CONTAINER] ) && this.target().isFull()) this.clearTarget()
  }
  }
}
