/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-19 13:50:37
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-02 00:12:02
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
  _.each(Storage.read(room.name + '-wall-spots', []), s => {
    room.visual.rect(s.x - 0.5, s.y - 0.5, 1, 1, { fill: Config.colors.purple })
  })
}
global.showRamps = function(roomName) {
  let room = Game.rooms[roomName]
  _.each(Storage.read(room.name + '-ramp-spots', []), r => {
    room.visual.rect(r.x - 0.5, r.y - 0.5, 1, 1, { fill: Config.colors.green })
  })
}
global.showExtensions = function(roomName) {
  let room = Game.rooms[roomName]
  let i = 1
  _.each(Storage.read(room.name + '-extension-spots', []), e => {
    room.visual.circle(e.x, e.y, { fill: Config.colors.red })
    room.visual.text(i, e.x, e.y, {color: Config.colors.green, font: 0.25 })
    i = i + 1
  })
}
global.pruneWalls = function(roomName) {
  RoomBuilder.pruneWalls(roomName)
}
global.clearBuiltWalls = function(roomName) {
  RoomBuilder.clearBuiltWalls(roomName)
  RoomBuilder.clearBuiltRamps(roomName)
}
global.planExtensions = function(roomName) {
  RoomBuilder.buildOutExtensions(roomName)
}
