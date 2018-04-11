/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-21 23:07:00
*/

'use strict';
let WallerCreep = function() {}


WallerCreep.prototype.waller = function() {
  this.chooseFillStatus()
  if(this.memory.status === 'fill') {
    if(this.needsTarget()) {
      this.setTarget(Targeting.findExclusiveEnergy(this.room.name))
    } else {
      this.work(this.pickup, this.target(), Config.defaultRange)
    }
  } else {
    if(this.needsTarget('wall')) {
      let target = Targeting.findWeakestWall(this.pos)
      this.setTarget(target, 'wall')
    }
    if(this.hasTarget('wall')) {
      this.repair(this.target('wall'))
    }
    if(this.isEmpty()) {
      this.clearTarget('wall')
      this.clearTarget()
    }
  }
}

