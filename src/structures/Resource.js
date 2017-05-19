/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-03-28 06:04:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-28 06:06:03
*/

'use strict';


Resource.prototype.energyAmount = function() {
  if(this.resourceType === RESOURCE_ENERGY) return this.amount
  return 0
}
