/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 09:43:31
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-01 23:22:03
*/

'use strict';



module.exports.loop = function () {
  PathFinder.use(true)
  _.forEach(Game.rooms, function(room, name) {
    room.tick()
    if(Config.showOverlay) {
      global.showWalls(room.name)
      global.showRamps(room.name)
      global.showExtensions(room.name)
    }
  })
  Log.tick()

}
