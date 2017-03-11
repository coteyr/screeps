/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 09:43:31
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-10 03:17:04
*/

'use strict';



module.exports.loop = function () {
  PathFinder.use(true)
  _.forEach(Game.rooms, function(room, name) {
    if(Game.cpu.bucket < 400) {
      Log.warn(['Building Bucket', Game.cpu.bucket])
      return false
    } else {
      global[name] = room
      room.tick()
    }
    if(Config.showOverlay) {
      global.showWalls(room.name)
      global.showRamps(room.name)
      global.showExtensions(room.name)
    }
  })
  Log.tick()

}
