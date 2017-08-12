/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-03-17 17:21:41
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-10 14:26:18
*/

'use strict';
class NormalTactic {
  static doAttack(creep, room) {
    creep.rangedMassAttack()
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
      Visualizer.target(creep.target())

      creep.attack(creep.target())


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
    if(creep.needsTarget() && creep.room.controller) {
      creep.moveTo(creep.room.controller)
    }
  }
}
