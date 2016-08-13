/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-10 13:42:20
*/

'use strict';


Creep.prototype.setupExoTankMemory = Creep.prototype.setupExoAttackerMemory
Creep.prototype.assignTravelExoTankTasks = function() {
    if (this.mode() !== 'move-out' && this.mode() !== 'transition') {
          var flag = this.room.find(FIND_FLAGS)[0]
          if(flag && _.size(flag.pos.findInRange(FIND_MY_CREEPS, 5)) >= 6 && this.hits >= this.hitsMax) {
            this.setMode('move-out')
          } else if(this.mode() !== 'move-out' && this.mode() != 'transition') {
            this.setMode('rally')
          }
          if(!flag) {
            this.setMode('move-out')
          }
    }
}
Creep.prototype.assignHomeExoTankTasks = function() {
  var flag = this.room.find(FIND_FLAGS)[0]
  if(flag && _.size(flag.pos.findInRange(FIND_MY_CREEPS, 5)) >= 6) {
    this.setMode('move-out')
  } else if(this.mode() !== 'move-out' && this.mode() != 'transition') {
    this.setMode('rally')
  }
}
Creep.prototype.assignRemoteExoTankTasks = function() {
  var flag = this.room.find(FIND_FLAGS)[0]
  if(flag) {
    if (this.hits >= 3500) {
      this.setMode('steal')
    } else if (this.hits < 3500) {
      this.setMode('heal')
    }
  } else {
    if (this.hits >= 1500){
      this.setMode('heal')
    } else {
      this.setMode('go-home')
    }
  }

}
