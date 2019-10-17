/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 09:43:31
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-05-19 23:13:52
*/

'use strict';

let STATS = {}
var Traveler = require('Traveler');

module.exports.loop = function () {
  Log.info("Tick Start")
  _.forEach(Game.structures, function(building) {
    if(building.structureType === STRUCTURE_LINK || building.structureType === STRUCTURE_TOWER || building.structureType === STRUCTURE_STORAGE){
      building.setupMemory()
      building.tick()
    }
  })
  _.forEach(Game.rooms, function(room) {
    room.tick()
    if(room.terminal) room.terminal.tick()
  })
  _.forEach(Game.creeps, function(creep) {
    creep.tick()
  })

}
