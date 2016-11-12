/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-11-09 06:45:02
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-09 06:48:11
*/

'use strict';

let SafeModeActive = {
  detect: function(room) {
    if(room.controller.safeMode) {
      Detectors.general(room, "Safe Mode Active", "Safe Mode is Active")
    }
  }
}
