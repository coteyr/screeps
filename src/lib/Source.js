/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:54:40
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-03 18:55:24
*/

'use strict';
Source.prototype.creepCount = function() {
  return Finder.findCreepsWithTarget(this.id).length
}
