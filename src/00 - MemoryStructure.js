/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-08 23:47:31
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-11 09:37:02
*/

'use strict';

let MemoryStructure = function(){};

MemoryStructure.prototype.setupMemory = function() {
  if(!Memory.memory_structures) {
    Memory.memory_structures = {};
  }
  if (!Memory.memory_structures[this.id]) {
    Memory.memory_structures[this.id] = {}
    this.memory = Memory.memory_structures[this.id]
  } else {
    this.memory = Memory.memory_structures[this.id];
  }
}


MemoryStructure.prototype.memory = undefined;
