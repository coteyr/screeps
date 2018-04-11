/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-05 10:44:55
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-28 05:58:15
*/

'use strict';

StructureStorage.prototype.hasRoom = function() {
  return this.store[RESOURCE_ENERGY] < this.energyCapacity
}
StructureStorage.prototype.isFull = function() {
  return !this.hasRoom()
}
StructureStorage.prototype.critical = function() {
  return this.store[RESOURCE_ENERGY] < this.storeCapacity * 0.25
}
StructureStorage.prototype.energyAmount = function() {
  return this.store[RESOURCE_ENERGY]
}