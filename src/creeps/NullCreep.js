/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-07 17:27:38
*/

'use strict';

let NullCreep = function() {}
NullCreep.prototype.superTick = function() {
    Log.warn(["Creep", this.name, "has no tasks"])
    this.moveTo(this.room.controller.pos.x + 3, this.room.controller.pos.y + 3)
  }