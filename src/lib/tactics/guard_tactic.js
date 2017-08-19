/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-03-17 17:21:41
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-15 04:56:16
*/

'use strict';
class GuardTactic {
  static doAttack(creep, room) {
    creep.rangedMassAttack()
    let says = ['You', 'shall', 'not', 'pass']
    let opts =  {reusePath: 5,
      visualizePathStyle: {opacity: 0.75, stroke: Config.colors.red},
      ignoreCreeps: false,
      maxRooms: 1

    }
    creep.say(says[Game.time % 4], true)
    let wall = null
    if(creep.needsTarget()) creep.setTarget(Targeting.findAttackTarget(creep.pos))
    if(creep.hasTarget()) {
      Visualizer.target(creep.target())
      creep.moveTo(creep.target(), {ignoreDestructibleStructures: false, ignoreCreeps: false})
      creep.attack(creep.target())


    }
    if(creep.needsTarget()) {
      creep.moveTo(GuardTactic.getRally(creep))
    }
  }
  static getRally(creep) {
    let rally = _.filter(Game.flags, f => {return f.color === COLOR_PURPLE && f.room.name == creep.room.name})
    Log.info(rally)
    if(rally.length > 0) {
      return rally[0]
    } else  if(creep.room.controller){
      return creep.room.controller
    } else {
      return new RoomPosition(25, 25, creep.room.name)
    }
  }
}
