/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-20 13:36:33
*/

'use strict';


Creep.prototype.setupExoTankMemory = Creep.prototype.setupExoAttackerMemory
Creep.prototype.assignTravelExoTankTasks = function() {
  this.heal(this)
  if (this.mode() !== 'move-out' && this.mode() !== 'transition') {
   this.setMode('rally')
    var flag = Finder.findFlags(this.room.name)[0]
    if(flag) {
      if(Game.rooms[this.memory.exo_target] && this.hits >= this.hitsMax) {
        if (_.size(Finder.findAllCreeps(this.memory.exo_target)) >= ARMY[this.room.tactic()].rally) this.setMode('move-out')
      }
      if(_.size(Targeting.findMyCloseCreeps(flag.pos, 5)) >= ARMY[this.room.tactic()].rally) this.setMode('move-out')
    } else {
      if(this.hits >= this.hitsMax) {
        this.setMode('move-out')
      } else {
        this.heal(this)
      }
    }
  }
}
Creep.prototype.assignHomeExoTankTasks = function() {
  var flag = this.room.find(FIND_FLAGS)[0]
  if(flag && _.size(flag.pos.findInRange(FIND_MY_CREEPS, 5)) >= 6) {
    this.setMode('move-out')
  } else if(this.hits < this.hitsMax) {
    this.heal(this)
  } else if(!flag) {
    this.setMode('move-out')
  } else if(this.mode() !== 'move-out' && this.mode() != 'transition') {
    this.setMode('rally')
  }
}
Creep.prototype.assignRemoteExoTankTasks = function() {
  this.heal(this)
  if(this.hits / this.hitsMax > 0.75) {
    this.doAttack()
  } else {
    this.setMode('go-home')
  }
}
