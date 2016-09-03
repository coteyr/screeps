/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:31:08
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-02 18:01:00
*/

'use strict';

RoomObject.prototype.tick = function() {
  return true; // No need to tick every last little thing.
  // body...
};

RoomObject.prototype.mode = function() {
  return this.memeory.mode
}

RoomObject.prototype.setMode = function(mode) {
  this.memory.old_mode = this.memory.mode
  if(this.memory.mode != mode) {
    this.memory.mode = mode || 'idle'
    if(mode !== 'idle') {
      delete this.memory.path
    }
    /*if(typeof this.say != "undefined") {
      this.say(mode)
    } else {
      Log.debug("Setting Mode: " + mode + " for " + this.id)
    }*/
  }
}

RoomObject.prototype.mode = function() {
  if(!this.memory.mode) {
    return 'idle'
  }
  return this.memory.mode
}

RoomObject.prototype.modeIs = function(mode) {
  return this.mode() === mode
}
RoomObject.prototype.setTarget = function(target) {
  if(target && target.id){
    this.memory.target = target.id
    delete this.memory.there
  } else if(target) {
    Log.error(this.name + " in " + this.room.name + ": Set Target expects and object with an id! Got: " + JSON.stringify(target))
  }
}
RoomObject.prototype.target = function() {
  if(this.memory.target) {
    return Game.getObjectById(this.memory.target)
  } else {
    return null
  }
}
RoomObject.prototype.clearTarget = function() {
  delete this.memory.target
  delete this.memory.there
}
RoomObject.prototype.hasTarget = function() {
  if(this.memory.target) {
    if(this.target()){
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}
RoomObject.prototype.needsTarget = function() {
  return !this.hasTarget()
}
