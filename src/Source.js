/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-23 09:34:17
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-01 05:17:21
*/

'use strict';

_.merge(Source.prototype, MemoryStructure.prototype);

Source.prototype.isSource = true

Source.prototype.tick = function() {
  this.setupMemory();
  this.checkMined()
}

Source.prototype.checkMined = function() {
  if(!this.memory.last_reading) {
    this.memory.last_reading = 1;
  }

  if(this.memory.last_reading === this.energy) {
    this.memory.mined = false
  } else {
    this.memory.mined = true
  }
  this.memory.last_reading = this.energy
}

Source.prototype.mined = function()  {
  return this.memory.mined
}

Source.prototype.memory = undefined;
