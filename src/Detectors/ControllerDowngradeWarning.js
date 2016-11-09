/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-11-09 01:10:14
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-09 01:17:59
*/

'use strict';

let ControlerDowngradeWarning = {
  detect: function() {
    Object.keys(Game.rooms).forEach(function(key, index) {
      let room = Game.rooms[key]
      if(room.controller && room.controller.my && room.controller.ticksToDowngrade < 5000) {
        Notify('Warning', "Controller downgrade soon", 1, "https://screeps.com/a/#!/room/" + room.name, 500)
      }
    })
  }
}
