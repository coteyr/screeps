/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-24 12:41:31
*/

'use strict';

// [select -> travel -> fill -> choose -> position -> build]
//                                    |-> travel -> repair ]
let ExoReaperCreep = function() {}
_.merge(ExoReaperCreep.prototype, StateMachine.prototype);


ExoReaperCreep.prototype.tickCreep = function() {
  this.checkState()
}

ExoReaperCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('goto')
  /* get to the room */
  if(this.stateIs('arrive')) this.setState('choose-target')

}

Creep.prototype.setupExoReaperMemory = function() {
  this.chooseExoTarget('reap')
}
Creep.prototype.assignTravelExoReaperTasks = function() {
  if (this.mode() !== 'move-out' && this.mode() !== 'transition') {
   if(this.isEmpty()) this.setMode('move-out')
   if(this.isFull()) this.setMode('go-home')
  }
}

Creep.prototype.assignHomeExoReaperTasks = function() {
  if(this.isEmpty()) this.setMode('move-out')
  if(this.hasSome()) this.setMode('dump')
}

Creep.prototype.assignRemoteExoReaperTasks = function() {
  if(this.hits < this.hitsMax) this.heal(this) //ALWAYS be healing
  if(this.mode() !== 'transition' ){ //&& this.mode() !== 'go-home') {
    // find a harvest target
    if(this.needsTarget()) {
      var target = Targeting.findReaperTarget(this.pos, this.room)
      this.setTarget(target)
    }
    if(this.hasTarget()) {
      let target = this.target()
      if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) {
        this.harvest(target)
      }
      // find if there are any hostels close and poke them, or harvest the target
    }
    if(this.isFull()) {
       this.setMode('go-home')
    }
  }
}
