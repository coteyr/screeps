/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 06:00:56
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-01 20:31:33
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
  };
