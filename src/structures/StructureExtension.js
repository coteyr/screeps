/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-05 10:44:55
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-05 10:45:02
*/

'use strict';

StructureExtension.prototype.hasRoom = function() {
  return this.energy < this.energyCapacity
}
StructureExtension.prototype.isFull = function() {
  return !this.hasRoom()
}
