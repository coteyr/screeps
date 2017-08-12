/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-06-08 00:20:36
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-06-08 14:53:25
*/

'use strict';
let RCL2Room = function() {}
RCL2Room.prototype.subTick = function() {
  this.tick()
  Log.info(["Processing Room", this.name])
  this.tickChildren()
  if(Finder.findIdleCreeps(this.name).length === 0) {
    this.spawnCreep()
  }
  this.assignCreeps()
  this.buildOut()

}
RCL2Room.prototype.assignCreeps = function() {
    if(this.needMiners()) this.assignTask('mine')
    if(this.needHaulers()) this.assignTask('haul')
    if(this.needBuilders()) this.assignTask("build")
    if(this.needUpgraders()) this.assignTask("upgrade")
}

RCL2Room.prototype.needMiners = function() {
  return this.needCreep('mine', WORK, 10, 4)
}
RCL2Room.prototype.needHaulers = function() {
  let needCarries = (this.energyCapacityAvailable / 2) / 50
  return this.needCreep('haul', CARRY, needCarries, 1)
}
RCL2Room.prototype.needBuilders = function() {
  return this.needCreep('build', WORK, Finder.findConstructionSites(this.name).length, 1)
}
RCL2Room.prototype.needUpgraders = function() {
  return this.needCreep('upgrade', WORK, 20, 1)
}
RCL2Room.prototype.buildOut = function() {
  RoomBuilder.buildPlan(this.name)
  //if(this.needWalls()) Log.error('I need Walls')
  switch(Game.time % 10) {
    case 1:
      if(this.needExtensions()) this.addExtension()
      break
  }
}
