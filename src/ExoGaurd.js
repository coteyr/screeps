/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-24 12:47:40
*/

'use strict';

// [select -> travel -> fill -> choose -> position -> build]
//                                    |-> travel -> repair ]
let ExoGaurdCreep = function() {}
_.merge(ExoGaurdCreep.prototype, StateMachine.prototype);


ExoGaurdCreep.prototype.tickCreep = function() {
  this.checkState()
}

ExoGaurdCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('goto')
  /* get to the room */
  if(this.stateIs('arrive')) this.setState('choose-target')

}

Creep.prototype.setupExoGaurdMemory = function() {
  this.chooseExoTarget('reap')
}
Creep.prototype.assignTravelExoGaurdTasks = function() {
  if (this.mode() !== 'move-out' && this.mode() !== 'transition') {
   this.setMode('move-out')
  }
}

Creep.prototype.assignHomeExoGaurdTasks = function() {
  this.setMode('move-out')
}

Creep.prototype.assignRemoteExoGaurdTasks = function() {
  if(this.hits < this.hitsMax) this.heal(this) //ALWAYS be healing
  if(this.mode() !== 'transition' ){ //&& this.mode() !== 'go-home') {
    // find a harvest target
    if(this.needsTarget()) {
      var target = Targeting.findReaperTarget(this.pos, this.room)
      var lair = Targeting.nearestKeeperLair(target.pos, this.room)
      this.setTarget(lair)
    }
    if(this.hasTarget()) {
      let target = this.target()
      var closest = Targeting.nearestHostalCreep(this.pos)
      if(closest && this.pos.getRangeTo(closest.pos) <= 4) {
        this.moveTo(closest.pos)
        this.attack(closest)
      } else if(Targeting.nearestDamagedFriendly(this.pos, this.room)) {
        let friend = Targeting.nearestDamagedFriendly(this.pos, this.room)
        this.moveTo(friend)
        this.heal(friend)
      } else {
        this.moveCloseTo(target.pos.x, target.pos.y)
      }
    }
  }
}
