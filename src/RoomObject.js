/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:31:08
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-29 02:16:24
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
  if(this.memory.mode != mode) {
    this.memory.mode = mode || 'idle'
    if(mode !== 'idle') {
      delete this.memory.path
    }
    if(typeof this.say != "undefined") {
      this.say(mode)
    } else {
      Log.debug("Setting Mode: " + mode + " for " + this.id)
    }
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
