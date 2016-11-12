/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-11-09 01:07:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-09 07:18:36
*/

'use strict';

let Detectors = {
  detect: function() {
    Detectors.roomDetect()
  },
  roomDetect: function() {
    Object.keys(Game.rooms).forEach(function(key, index) {
      let room = Game.rooms[key]
      if(room && room.controller && room.controller.my){
        ControlerDowngradeWarning.detect(room)
        SafeModeActive.detect(room)
        SafeModeFalling.detect(room)
        ControllerUpgraded.detect(room)
      }
    })
  },
  warn: function(room, title, message) {

    Detectors.send(room, title, message, 1)
  },
  general: function(room, title, message) {
    Detectors.send(room, title, message, 0)
  },
  good: function(room, title, message){
    Detectors.send(room, title, message, -1)
  },
  send: function(room, title, message, level) {
    if(!Memory[room.name + "-last-sent-" + title]) Memory[room.name + "-last-sent-" + title] = 0
    if(Game.time > (Memory[room.name + "-last-sent-" + title] + 500)) {
      Memory[room.name + "-last-sent-" + title] = Game.time
      Notify(title, message, level, "https://screeps.com/a/#!/room/" + room.name)
    }
  }

}
