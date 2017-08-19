/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-06-29 21:13:13
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-19 07:35:14
*/

'use strict';
let RecoveryCreep = function() {}
RecoveryCreep.prototype.recover = function() {
  this.chooseFillStatus()
  if(this.memory.status === 'fill') {
    this.harvest()
  } else {
    this.doRecoveryWork()
  }
}
RecoveryCreep.prototype.doRecoveryWork = function() {
  if(this.room.isFull()) {
    this.upgradeController()
  } else {
    if(this.needsTarget('drop')) this.setTarget(Targeting.findClosestEnergyStoreInNeed(this.pos), 'drop') // this.setTarget(Finder.findEnergyStoreInNeed(this.room.name))
    if(this.hasTarget('drop')) {
      this.transfer(this.target('drop'))
      if(this.target('drop').isFull()) this.clearTarget('drop')
    }
  }
}


