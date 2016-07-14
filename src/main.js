/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 06:00:56
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-12 23:36:10
*/

'use strict';

var logLevel = 4; //show it all

module.exports.loop = function () {
  Object.keys(Game.rooms).forEach(function(key, index) {
    this[key].tick();
  }, Game.rooms);
    //new Spawner(Game.spawns.Spawn1).tick();
    /*_.filter(Game.creeps).forEach(function(creep) {
      creep.tick();
    });*/
    Log.tick();
    Memory.stats["gclLevel"] = Game.gcl.level
    Memory.stats['gclProgress'] = Game.gcl.progress
    Memory.stats['gclProgressTotal'] = Game.gcl.progressTotal
    Memory.stats["cpuTotal"] = Game.cpu.limit
    Memory.stats["cpuBucket"] = Game.cpu.bucket
    Memory.stats["cpuUsed"] = Game.cpu.getUsed() //should be last
  };
