/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-07 09:31:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-08 23:34:20
*/

'use strict';

_.merge(StructureStorage.prototype, EnergyStructure.prototype);

StructureStorage.prototype.energyCallModifier = 0.1 // not too low

StructureStorage.prototype.memory = undefined;
