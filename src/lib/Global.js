/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-19 13:50:37
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-19 14:19:19
*/

'use strict';

global.addWalls = function(roomName) {
  RoomBuilder.addWalls(roomName)
}
global.addRamps = function(roomName) {
  RoomBuilder.addRamps(roomName)
}
global.showWalls = function(roomName) {
  let room = Game.rooms[roomName]
  let spots = Storage.read(room.name + '-wall-spots', [])
  _.each(spots, s => {
    room.visual.rect(s.x - 0.5, s.y - 0.5, 1, 1, { fill: Config.colors.purple })
  })
}
