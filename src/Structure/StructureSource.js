/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 03:44:02
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-12 04:00:09
*/

'use strict';
Source.prototype.creepCount = function() {
  return Finder.creepsWithTarget('mine', this).length
}
