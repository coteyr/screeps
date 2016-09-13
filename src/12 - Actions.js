/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-09-12 15:47:32
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-13 09:27:20
*/

'use strict';

let Actions = {

  moveToTarget: function(creep, target, exitState, range = 1) {
    if(target) {
      if(creep.moveCloseTo(target.pos.x, target.pos.y, range)) creep.setState(exitState)
    } else {
      creep.setState(exitState)
    }
  },
  mine: function(creep, target, exitState = 'dump', fill=false) {
    creep.harvest(target)
    if(!fill && creep.hasSome()) creep.setState(exitState)
    if(fill && creep.isFull()) creep.setState(fill)
  },
  grab: function(creep, target, exitState = 'dump'){
    if(target.transfer) target.transfer(creep, RESOURCE_ENERGY)
    if(target.withdraw) creep.withdraw(target, RESOURCE_ENERGY)
    creep.setState(exitState)
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
  dump: function(creep, target, exitState) {
    creep.dumpResources(target)
    creep.setState(exitState)
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
    if(target) {
      creep.repair(target)
      if(target.hits >= target.hitsMax) creep.setState(exitState)
      if(!target.hits) creep.setState(failState)
    } else {
      creep.setState(failState)
    }
    if(creep.isEmpty()) creep.setState(failState)
  },
  upgrade: function(creep, exitState) {
    creep.upgradeController(creep.room.controller)
    if(creep.isEmpty()) creep.setState(exitState)
  }

}

module.exports = Actions
