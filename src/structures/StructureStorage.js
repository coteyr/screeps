/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-05 10:44:55
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-09 15:10:52
*/

'use strict';

StructureStorage.prototype.hasRoom = function() {
  return this.energy < this.energyCapacity
}
StructureStorage.prototype.isFull = function() {
  return !this.hasRoom()
}
