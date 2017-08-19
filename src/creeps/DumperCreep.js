/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-19 07:39:02
*/

'use strict';

let DumperCreep = function() {}

DumperCreep.prototype.dumper = function() {
  this.chooseFillStatus()
  if(this.memory.status === 'fill') {
    if(this.room.name === this.memory.home) {
      // fill up

        this.pickup(this.room.storage)

    } else {
      let pos = new RoomPosition(25, 25, this.memory.home)
      this.moveTo(pos)
    }
  } else {
    if(this.gotoTargetRoom()) {
      this.upgradeController()
    }
  }
}



