/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-11-09 01:10:14
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-09 06:41:21
*/

'use strict';

let ControlerDowngradeWarning = {
  detect: function(room) {
    if(room.controller.ticksToDowngrade < 5000) {
      Detectors.warn(room, "Controller Downgrade", "Controller downgrade soon")
    }
  }
}
