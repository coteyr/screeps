/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-21 12:26:06
*/

'use strict';

let NullCreep = function() {}
NullCreep.prototype.superTick = function() {
    this.room.visual.text('\u231B', this.pos, {color: Config.colors.yellow, size: 0.25})
    Log.warn(["Creep", this.name, "has no tasks"])
    let pos = new RoomPosition(this.room.controller.pos.x + 3, this.room.controller.pos.y + 3, this.room.name)
    this.goTo(pos)
    if(this.hasSome()) this.setTask('haul')
  }
