/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-29 19:24:01
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-01-29 19:53:23
*/

'use strict';

Room.prototype.tick = function() {
  Log.debug(['Ticking Room:', this.name])
  if(this.controller && this.controller.safeMode) {
    Log.print(["Safe Mode Until", this.controller.safeModeTill()], this.name)
  }

}
