/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-08-14 18:06:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-14 22:20:56
*/

'use strict';
class BaitTactic {
  static doAttack(homeRoomName) {
    let says = ['You', 'have', 'not', 'enough', 'minerals']
    let opts =  {reusePath: 0,
      visualizePathStyle: {opacity: 0.75, stroke: Config.colors.red},
      ignoreCreeps: false,
      maxRooms: 1

    }
    let baits = _.filter(Game.creeps, e => {return  e.memory.task === 'bait' && e.memory.home === homeRoomName})
    let medic = _.filter(Game.creeps, e => {return  e.memory.task === 'medic' && e.memory.home === homeRoomName})
    let mostNeed = BaitTactic.mostNeededHeal(baits)
    _.each(baits, c =>{
      c.say(says[Game.time % 5], true)
      c.rangedMassAttack()
      let target = Targeting.findNearestTarget(c.pos)
      if(target) c.attack(target)
    })
    if(medic.length >= 1) {
      if(BaitTactic.inTargetRoom() && medic.room.name !== medic.memory.targetRoom) {
        let pos = new RoomPosition(25, 25, medic.memory.targetRoom)
        medic.moveTo(pos)
        return true
      }
      medic = medic[0]
      if(medic.room.name === medic.memory.targetRoom && medic.pos.x > 1 && medic.pos.y > 1) {
        let target = Targeting.findNearestTarget(medic.pos)
        if (target) {
          if(medic.hits < medic.hitsMax){
            medic.heal(medic)
          } else {
            medic.heal(mostNeed)
          }
        } else {
          let pos = BaitTactic.getRally(medic.room)
          if(BaitTactic.squadReady(baits, medic))  medic.moveTo(pos)
          mostNeed = Scalar.smallest(_.filter(Game.creeps, c => c.room.name === medic.room.name && c.hits < c.hitsMax), 'hits')
          if(mostNeed && mostNeed.hits < mostNeed.hitsMax) {
            medic.moveTo(mostNeed)
            medic.rangedHeal(mostNeed)
            medic.heal(mostNeed)
          }
        }
        let spot = 1
        let x = medic.pos.x
        let y = medic.pos.y
        _.each(baits, c =>{

          if(medic.pos.x === 23 && medic.pos.y === 24) {
            Log.info('g')
            if(spot = 1) {
              x = x + 1
            }
            if(spot = 2) {
              x = x - 1
            }
            if(spot = 3) {
              y = y + 1
            }
            if(spot = 4) {
              y = y - 1
            }
            let pos1 = new RoomPosition(x, y, medic.memory.targetRoom)
            Log.info(c.moveTo(pos1, opts))
            spot = spot + 1
          } else {
            if(BaitTactic.squadReady(baits, medic)) c.moveTo(medic.pos)
          }

        })

      // Attack Stuffs
      } else {
        let pos = new RoomPosition(25, 25, medic.memory.targetRoom)
        if(BaitTactic.squadReady(baits, medic) || medic.pos.x <= 1 || medic.pos.y <= 1) medic.moveTo(pos)
        _.each(baits, c =>{

          if(BaitTactic.squadReady(baits, medic)) c.moveTo(pos)

        })
      }
    //creep.say(says[Game.time % 5], true)
    }
  }
  static squadReady(baits, medic) {
    let ready = true
    _.each(baits, c =>{
      if(c.fatigue > 0) ready = false
      if(c.room.name !== medic.room.name) ready = true
    })

    return ready
  }
  static mostNeededHeal(baits) {
    return Scalar.smallest(baits, 'hits')
  }
  static inTargetRoom(baits) {
    let inRoom = false
    _.each(baits, c =>{
      if(c.memory.targetRoom === c.room.name) inRoom = true
    })
    return inRoom
  }
  static getRally(room) {
    let rally = _.filter(Game.flags, f => {return f.color === COLOR_PURPLE && f.room.name == room.name})
    Log.info(rally)
    if(rally.length > 0) {
      return rally[0]
    } else  if(room.controller){
      return room.controller
    } else {
      return new RoomPosition(25, 25, room.name)
    }
  }
}
