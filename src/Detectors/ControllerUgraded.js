/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-11-09 06:52:06
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-09 07:06:11
*/

'use strict';

let ControllerUpgraded = {
  detect: function(room) {
    if(!Memory[room.name + "-controller-level"]) Memory[room.name + "-controller-level"] = 0
    if(room.controller.level > Memory[room.name + "-controller-level"]) {
      Memory[room.name + "-controller-level"] = room.controller.level
      Detectors.good(room, "Controller Upgraded", "Controller has been upgraded to level " + room.controller.level)
    }
  }
}
