/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 09:43:31
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-01-29 19:28:56
*/

'use strict';



module.exports.loop = function () {
  _.forEach(Game.rooms, function(room, name) {
    room.tick()
  })
  Log.tick()
}
