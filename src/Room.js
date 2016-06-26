/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:39:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 11:46:47
*/

'use strict';

Room.prototype.tick = function() {
  Log.info('Ticking Room: ' + this.name);
  return true;
};
