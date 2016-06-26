/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 06:00:56
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 06:01:41
*/

'use strict';

module.exports.loop = function () {
    //new Spawner(Game.spawns.Spawn1).tick();
    Game.spawns.Spawn1.tick();
    /*_.filter(Game.creeps).forEach(function(creep) {
      creep.tick();
    });*/
  };
