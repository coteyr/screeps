/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-03-17 17:21:41
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-18 08:11:51
*/

'use strict';
class NormalTactic {
  static doAttack(creep, room) {
    let says = ['Lead', 'us', 'for', 'the', 'swarm']
    let opts =  {reusePath: 5,
      visualizePathStyle: {opacity: 0.75, stroke: Config.colors.red},
      ignoreCreeps: false,
      maxRooms: 1

    }
    creep.say(says[Game.time % 5], true)
    let wall = null
    if(creep.needsTarget()) creep.setTarget(Targeting.findAttackTarget(creep.pos))
    if(creep.hasTarget()) {
      if(creep.attack(creep.target()) === ERR_NOT_IN_RANGE) {
        Visualizer.target(creep.target())
        creep.moveTo(creep.target(), opts)
      }
    }
    var structures = creep.pos.findInRange(FIND_STRUCTURES, 1)
    let walls = _.filter(structures, s =>  { return s.type === "structure" && (s.structure.structureType === "constructedWall" || s.structureType == STRUCTURE_RAMPART) })//{ Log.info(JSON.stringify(s)) }) //return s.structureType == "constructedWall" }) // s.structureType === STRUCTURE_WALL })
    let smallest = 999999999
    _.each(walls, w => {
      if(w.structure.hits < smallest) {
        smallest = w.structure.hits
        wall = w.structure
      }
    })
    if(!_.isNull(wall)) creep.attack(wall)
  }
}
