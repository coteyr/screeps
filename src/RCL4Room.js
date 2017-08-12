/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-06-08 00:20:36
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-07-02 18:29:07
*/

'use strict';
let RCL4Room = function() {}
RCL4Room.prototype.subTick = function() {
  this.tick()
  Log.info(["Processing Room", this.name])
  this.tickChildren()
  if(Finder.findIdleCreeps(this.name).length === 0) {
    this.spawnCreep()
  }
  this.assignCreeps()
  this.buildOut()

}
RCL4Room.prototype.assignCreeps = function() {
    if(this.needMiners()) this.assignTask('mine')
    if(this.needHaulers()) this.assignTask('haul')
    if(this.needBuilders()) this.assignTask("build")
    if(this.needUpgraders()) this.assignTask("upgrade")
}

RCL4Room.prototype.needMiners = function() {
  return this.needCreep('miner', WORK, 10, 4)
}
RCL4Room.prototype.needHaulers = function() {
  let needCarries = (this.energyCapacityAvailable / 2) / 50
  return this.needCreep('haul', CARRY, needCarries, 1)
}
RCL4Room.prototype.needBuilders = function() {
  return this.needCreep('build', WORK, Finder.findConstructionSites(this.name).length, 1)
}
RCL4Room.prototype.needUpgraders = function() {
  return this.needCreep('upgrade', WORK, 20, 1)
}
RCL4Room.prototype.buildOut = function() {
  RoomBuilder.buildPlan(this.name)
  //if(this.needWalls()) Log.error('I need Walls')
  switch(Game.time % 10) {
    case 1:
      if(this.needExtensions()) this.addExtension()
      break
    case 2:
      if(this.hasTowers() && this.needWalls()) this.addWalls()
      break
    case 4:
      if(this.needTowers()) this.addTowers()
    break
  }
}

