/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-03-17 17:21:41
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-19 02:58:08
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
      creep.moveTo(Targeting.getRally(creep))
    }
  }

}
