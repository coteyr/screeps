/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-10-03 18:53:23
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-04 06:39:17
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
      if(creep.move(creep.memory.exit_dir) === 0 || !creep.memory.exit) {
        delete creep.memory.exit_dir
        delete creep.memory.exit
        delete creep.memory.goto_room
        delete creep.memory.old_room
        creep.setState(exitStatus)
      }
    }

    /*if(creep.room.name === creep.memory.old_room) {
      delete creep.memory.exit
      delete creep.memory.exit_dir
    }*/
    if(creep.room.name !== creep.memory.old_room){
      delete creep.memory.exit
      delete creep.memory.exit_dir
    }
    creep.memory.old_room = creep.room.name
  },
  attack: function(creep, exitStatus) {
    creep.doAttack()
  }
}
