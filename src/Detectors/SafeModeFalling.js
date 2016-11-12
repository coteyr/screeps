/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-11-09 06:52:06
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-09 06:52:53
*/

'use strict';

let SafeModeFalling = {
  detect: function(room) {
    if(room.controller.safeMode && room.controller.safeMode < 500) {
      Detectors.warn(room, "Safe Mode Falling", "Safe Mode will drop soon")
    }
  }
}
