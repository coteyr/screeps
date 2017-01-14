/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 06:00:56
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-01-04 23:05:19
*/

'use strict';
let Notify = require('notify')

var RAM = {}

String.prototype.toCamel = function(){
  return this.replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');}).replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
};
String.prototype.toUnderscore = function(){
  return this.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
};
//let Memory = {}
var logLevel = 4;

module.exports.loop = function () {
  RAM = {}
  //global.resetUsedCPU()
  Alarm.tick()
  Reporting.tickStart()
  Detectors.detect()

  Object.keys(Game.rooms).forEach(function(key, index) {
    let room = this[key]
    if(room.strategyIs('objects')) {
      room.tick();
    } else if(room.strategyIs('dumb')) {
      _.merge(Room.prototype, DumbRoom.prototype)
      room.tickRoom()
    } else if (room.strategyIs('logic')) {
      _.merge(Room.prototype, LogicRoom.prototype)
      room.tickRoom()
    } else {
      Log.error("<h1>Room " + room.name + " has no strategy and is idle!</h1>")
    }

    global[key] = this[key] // shortcuts
    //global.logUsedCPU(this[key])
  }, Game.rooms);
  Reporting.tickEnd()

  Log.tick();

  Reporting.setEmpireValue('cpuUsed', Game.cpu.getUsed())
  Reporting.setEmpireValue('bucket', Game.cpu.bucket)
  Reporting.setEmpireValue('cpuLimit', Game.cpu.limit)
  Reporting.setEmpireValue('tick', Game.time)
  Reporting.setEmpireValue('creepCount', _.size(Game.creeps))
  Reporting.setEmpireValue('currentGCL', Game.gcl.level)
  Reporting.setEmpireValue('gclProgress', Game.gcl.progress)
  Reporting.setEmpireValue('gclTotal', Game.gcl.progressTotal)
  Reporting.setEmpireValue('energyTick', Memory.harvest_this_tick)
}
