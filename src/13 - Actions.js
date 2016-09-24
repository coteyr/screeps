/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-09-12 15:47:32
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-23 14:41:08
*/

'use strict';

let Actions = {

  moveToTarget: function(creep, target, exitState, range = 1, failState = false) {
    if(target) {
      if(creep.moveCloseTo(target.pos.x, target.pos.y, range) === true) creep.setState(exitState)
      let ext = Targeting.findCloseExtension(creep.pos)
      if(ext && ext.hasRoom() && creep.hasSome()) creep.dumpResources(ext)
    } else if(failState){
      creep.setState(failState)
    } else {
      creep.setState(exitState)
    }
  },
  mine: function(creep, target, exitState = 'dump', fill=false) {
    creep.harvest(target)
    if(!fill && creep.hasSome()) creep.setState(exitState)
    if(fill && creep.isFull()) creep.setState(fill)
    if(target.energy < 20) creep.setState(exitState)
  },
  grab: function(creep, target, exitState = 'dump', failState = false){
    if(target.transfer) target.transfer(creep, RESOURCE_ENERGY)
    if(target.withdraw) creep.withdraw(target, RESOURCE_ENERGY)
    if(creep.isFull()) {
      creep.setState(exitState)
    } else if(failState){
      creep.setState(failState)
    } else {
      creep.setState(exitState)
    }
  },
  mineOrGrab: function(creep, target, exitState, fill, failState) {
    if(target) {
      if(target.ticksToRegeneration && fill) Actions.mine(creep, target, exitState, exitState)
      if(target.ticksToRegeneration && !fill) Actions.mine(creep, target, exitState, false)
      if(target.resourceType) Actions.pickup(creep, target, exitState)
      if(target.storeCapacity) Actions.grab(creep, target, exitState)
    } else {
      creep.setState(failState)
    }
    if(fill && creep.hasRoom()) creep.setState(failState)
  },
  pickup: function(creep, target, exitState) {
    creep.pickup(target)
    creep.setState(exitState)
  },
  dump: function(creep, target, exitState, failState = false) {
    creep.dumpResources(target)
    if(creep.isEmpty()) {
      creep.setState(exitState)
    } else if(failState) {
      creep.setState(failState)
    } else {
      creep.setState(exitState)
    }
  },
  targetWithState: function(creep, finder, successState, failState = false) {
    creep.clearTarget()
    creep.setTarget(finder)
    if (creep.hasTarget()) creep.setState(successState)
    if (failState && creep.needsTarget()) creep.setState(failState)
  },
  chooseState: function(creep, condition, trueState, falseState) {
    if(condition) {
      creep.setState(trueState)
      return trueState
    } else {
      creep.setState(falseState)
      return falseState
    }
  },
  pickup: function(creep, target, exitState) {
    creep.pickup(target)
    creep.setState(exitState)
  },
  build: function(creep, target, exitState, failState) {
    if(target) {
      creep.build(target)
    } else {
      creep.setState(failState)
    }
    if(creep.isEmpty()) creep.setState(exitState)
  },
  repair: function(creep, target, exitState, failState) {
    if(target && target.hits >= target.hitsMax) {
      creep.setState(exitState)
    } else if(target && target.hits < target.hitsMax) {
      creep.repair(target)
    } else {
      console.log('aaa')
      creep.setState(failState)
    }
    if(creep.isEmpty()) creep.setState(failState)
  },
  upgrade: function(creep, exitState) {
    creep.upgradeController(creep.room.controller)
    if(creep.isEmpty()) creep.setState(exitState)
  },
  demolish: function(creep, target, exitState, fill, failState) {
    creep.dismantle(target)
    if(creep.isFull()) creep.setState(exitState)
    if(!target && fill && creep.hasRoom()) {
      creep.setState(failState)
    } else if(!target && !fill) {
      creep.setState(existState)
    } else {
      creep.setState(existState)
    }
  },
  excavate: function(creep, target, exitState) {
    creep.harvest(target)
    creep.setState(exitState)
  }

}

module.exports = Actions
