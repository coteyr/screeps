/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 10:07:27
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-14 22:20:38
*/

'use strict';
Creep.prototype.haulerTick = function() {
  if(this.hasEnergy()) {
    this.clearTarget('source')
    this.haul()
  } else {
    if(this.hasTarget('source')) {
      this.grab(this.getTarget('source'))
    } else {
      if(!this.setTarget('source', Targeting.unclaimedEnergy(this.room))) {
        Log.error("Failed to set source energy Target!", this)
      }
    }
  }
}

Creep.prototype.haul = function(){
  if(this.hasTarget('dest')) {
    this.dump(this.getTarget('dest'))
  } else {
    if(!this.setTarget('dest', Targeting.energyDump(this.room, this.pos))) {
        Log.error("Failed to set destination energy Target!", this)
        Log.debug('gg')
        let pos = new RoomPosition(this.room.controller.pos.x - 3, this.room.controller.pos.y - 3, this.room.name);
        this.moveTo(pos)
        if(this.pos.x === pos.x && this.pos.y === pos.y) this.drop(RESOURCE_ENERGY)
    }
  }
}

Creep.prototype.dump = function(target){
  let value = this.work(this.transfer, target, 1, [RESOURCE_ENERGY])
  if(value !== ERR_NOT_IN_RANGE) {
    this.clearTarget('dest')
  }
}
