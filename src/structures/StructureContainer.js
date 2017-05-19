/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-05 10:44:55
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-28 05:59:09
*/

'use strict';

StructureContainer.prototype.hasRoom = function() {
  return this.store[RESOURCE_ENERGY] < this.energyCapacity
}
StructureContainer.prototype.isFull = function() {
  return !this.hasRoom()
}
StructureContainer.prototype.critical = function() {
  return this.store[RESOURCE_ENERGY] < this.storeCapacity * 0.25
}
StructureContainer.prototype.energyAmount = function() {
  return this.store[RESOURCE_ENERGY]
}
