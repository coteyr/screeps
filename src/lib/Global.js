/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-19 13:50:37
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-01 21:26:00
*/

'use strict';

global.resetWalls = function(roomName) {
  let room = Game.rooms[roomName]
  delete room.memory.top
  delete room.memory.bottom
  delete room.memory.left
  delete room.memory.right
  global.addWalls(roomName)

}
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
global.pruneWalls = function(roomName) {
  RoomBuilder.pruneWalls(roomName)
}
global.clearBuiltWalls = function(roomName) {
  RoomBuilder.clearBuiltWalls(roomName)
  RoomBuilder.clearBuiltRamps(roomName)
}
