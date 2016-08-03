/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-07 09:31:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-02 17:53:08
*/

'use strict';

_.merge(StructureContainer.prototype, EnergyStructure.prototype);

StructureContainer.prototype.energyCallModifier = 0.0;

StructureContainer.prototype.storedResources = function() {
  return (_.sum(this.store) - this.store['energy'])
}
