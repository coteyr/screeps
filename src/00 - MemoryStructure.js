/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-08 23:47:31
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-08 23:49:46
*/

'use strict';

let MemoryStructure = function(){};

MemoryStructure.prototype.setupMemory = function() {
  if(!this.room.memory.memory_structures) {
    this.room.memory.memory_structures = {};
  }
  if (!this.room.memory.memory_structures[this.id]) {
    this.room.memory.memory_structures[this.id] = {}
    this.memory = this.room.memory.memory_structures[this.id]
  } else {
    this.memory = this.room.memory.memory_structures[this.id];
  }
}


MemoryStructure.prototype.memory = undefined;
