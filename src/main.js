/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 09:43:31
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-15 04:44:10
*/

'use strict';

let STATS = {}
module.exports.loop = function () {
  Log.info("Tick Start")
  _.forEach(Game.rooms, function(room) {
    room.tick()
  })
  _.forEach(Game.creeps, function(creep) {
    creep.tick()
  })
  _.forEach(Game.structures, function(building) {
    if(building.structureType === STRUCTURE_TOWER) building.tick()
  })
}
