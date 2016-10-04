/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-10-03 18:53:23
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-04 00:14:14
*/

'use strict';

let MilitaryActions = {
  rally: function(creep, size, exitStatus, failStatus) {
    var flag = Finder.findFlags(creep.room.name)[0]
    if(!flag) {
      creep.setState(failStatus)
    } else {
      creep.moveCloseTo(flag.pos.x, flag.pos.y, 2)
      if(_.size(flag.pos.findInRange(FIND_MY_CREEPS, 5)) >= size) creep.setState(exitStatus)
    }
  },
  moveOut: function(creep, targetRoom, exitStatus, failStatus) {
    creep.gotoRoom(targetRoom)
    if(creep.room.name !== targetRoom) creep.setState(failStatus)
    if(creep.room.name === targetRoom) {
      creep.setState(exitStatus)
      delete creep.memory.exit
      delete creep.memory.exit_dir
    }
    creep.memory.old_room = creep.room.name
  },
  attack: function(creep, exitStatus) {
    creep.doAttack()
  }
}
