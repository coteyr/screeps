/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-09-12 15:47:32
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-08 06:48:23
*/

'use strict';

let Actions = {

  moveToTarget: function(creep, target, exitState, range = 1, failState = false) {
    creep.spout('\u27A4')
    if(target) {
      if(creep.moveCloseTo(target.pos.x, target.pos.y, range) === true) creep.setState(exitState)
      if(!creep.room.hasHostiles() && !creep.room.needsConstruction()) {
        let ext = Targeting.findCloseExtension(creep.pos)
        if(ext && ext.hasRoom() && creep.hasSome()) creep.dumpResources(ext)
      }
    } else if(failState){
      creep.setState(failState)
    } else {
      creep.setState(exitState)
    }
  },
  mine: function(creep, target, exitState = 'dump', fill=false) {
    creep.spout('\u26CF')
    creep.harvest(target)
    if(!fill && creep.hasSome()) creep.setState(exitState)
    if(fill && creep.isFull()) creep.setState(fill)
    if(target.energy < 20) creep.setState(exitState)
  },
  grab: function(creep, target, exitState = 'dump', failState = false){
    creep.spout('\u2BB8')
    if(target.transfer) target.transfer(creep, RESOURCE_ENERGY)
    if(creep.withdraw) creep.withdraw(target, RESOURCE_ENERGY)
    if(target.resourceType) creep.pickup(target)
    if(creep.isFull()) {
      creep.setState(exitState)
    } else if(failState){
      creep.setState(failState)
    } else {
      creep.setState(exitState)
    }
  },
  mineOrGrab: function(creep, target, exitState, fill, failState) {
    creep.spout('\u26CF')
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
    creep.spout('\u2BED')
    creep.pickup(target)
    creep.setState(exitState)
    creep.clearTarget()
  },
  dump: function(creep, target, exitState, failState = false) {
    creep.spout('\u2B73')
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
    creep.spout('\u2609')
    creep.clearTarget()
    creep.setTarget(finder)
    if (creep.hasTarget()) creep.setState(successState)
    if (failState && creep.needsTarget()) creep.setState(failState)
  },
  chooseState: function(creep, condition, trueState, falseState) {
    creep.spout('\u21F9')
    if(condition) {
      creep.setState(trueState)
      return trueState
    } else {
      creep.setState(falseState)
      return falseState
    }
  },
  pickup: function(creep, target, exitState) {
    creep.spout('\u26BB')
    creep.pickup(target)
    creep.setState(exitState)
  },
  build: function(creep, target, exitState, failState) {
    creep.spout('\u2692')
    if(target) {
      creep.build(target)
    } else {
      creep.setState(failState)
    }
    if(creep.isEmpty()) creep.setState(exitState)
  },
  repair: function(creep, target, exitState, failState) {
    creep.spout('\u26D1')
    if(target && target.hits >= target.hitsMax) {
      creep.setState(exitState)
    } else if(target && target.hits < target.hitsMax) {
      creep.repair(target)
    } else {
      creep.setState(failState)
    }
    if(creep.isEmpty()) creep.setState(failState)
  },
  upgrade: function(creep, exitState) {
    creep.spout('\u26E3')
    creep.upgradeController(creep.room.controller)
    if(creep.isEmpty()) creep.setState(exitState)
  },
  demolish: function(creep, target, exitState, fill, failState) {
    creep.spout('\u26D4')
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
    creep.spout('\u2604')
    creep.harvest(target)
    creep.setState(exitState)
  },
  dispurse: function(creep, exitState){
    creep.spout('\u26D5')
    creep.moveTo(25, 25)
    creep.setState(exitState)
  }

}

module.exports = Actions
