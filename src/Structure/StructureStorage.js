/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-15 05:26:04
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-22 14:51:16
*/

'use strict';
StructureStorage.prototype.tick = function() {
  if(this.store[RESOURCE_ENERGY] > 0.75 * this.storeCapacity) {
    this.memory.buffered = true
  } else if (this.store[RESOURCE_ENERGY] < 50 * this.storeCapacity) {
    this.memory.buffered = false
  }
}
StructureStorage.prototype.hasBuffer = function() {
  return this.memory.buffered && this.memory.buffered == true
}

StructureStorage.prototype.setupMemory = function() {
  if(!Memory.memory_structures) Memory.memory_structures = {}
  if(!Memory.memory_structures[this.id]) {
    Memory.memory_structures[this.id] = {}
    this.memory = Memory.memory_structures[this.id]
  } else {
    this.memory = Memory.memory_structures[this.id]
  }
}
