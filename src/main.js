/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 06:00:56
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-08 13:56:29
*/

'use strict';
var RAM = {}
var msgpack = require("msgpack.min");
var Buffer = require("buffer").Buffer ;
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
  if(!Memory.harvest_total) Memory.harvest_total = 0
  if(!Memory.harvest_count) Memory.harvest_count = 0
  if(!Memory.harvest_average) Memory.harvest_average = 0


  Memory.harvest_last_tick = Memory.harvest_this_tick
  Memory.harvest_this_tick = 0
  if(Game.time % 10 == 0) {
    Memory.harvest_total = 0
    Memory.harvest_count = 0
  }


  //Memory.spread_targets = []
  /*var choices = [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT];
  var choice = choices[Math.floor(Math.random()*choices.length)];
  Memory.dance_move = choice
  _.each(Object.keys(Game.rooms), function(room) {
    Game.rooms[room].tick()
  })*/
  Object.keys(Game.rooms).forEach(function(key, index) {
    this[key].tick();
    global[key] = this[key] // shortcuts
    //global.logUsedCPU(this[key])
  }, Game.rooms);
    Memory.harvest_total += Memory.harvest_this_tick
    Memory.harvest_count += 1
    Memory.harvest_average = Memory.harvest_total / Memory.harvest_count
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
