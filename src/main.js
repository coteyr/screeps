/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 06:00:56
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-12 22:42:37
*/

'use strict';
var profiler = require('screeps-profiler');

String.prototype.toCamel = function(){
  return this.replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');}).replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
};
String.prototype.toUnderscore = function(){
  return this.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
};

var logLevel = 4;

 profiler.enable();
module.exports.loop = function () {
  global.resetUsedCPU()
  profiler.wrap(function() {

  Memory.spread_targets = []
  var choices = [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT];
  var choice = choices[Math.floor(Math.random()*choices.length)];
  Memory.dance_move = choice
  Object.keys(Game.rooms).forEach(function(key, index) {
    this[key].tick();
    global.logUsedCPU(this[key])
  }, Game.rooms);
    //new Spawner(Game.spawns.Spawn1).tick();
    /*_.filter(Game.creeps).forEach(function(creep) {
      creep.tick();
    });*/
    Log.tick();
    Memory.stats['totalCreeps'] = _.size(Game.creeps)
    });
  };
