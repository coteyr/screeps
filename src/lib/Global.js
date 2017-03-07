/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-19 13:50:37
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-06 21:08:24
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
  Visualizer.showSquares(roomName, Storage.read(room.name + '-wall-spots', []), Config.colors.purple)
}
global.showRamps = function(roomName) {
  let room = Game.rooms[roomName]
  Visualizer.showSquares(roomName, Storage.read(room.name + '-ramp-spots', []), Config.colors.green)
}
global.showExtensions = function(roomName) {
  let room = Game.rooms[roomName]
  Visualizer.showCircles(roomName, Storage.read(room.name + '-extension-spots', []), Config.colors.red, true)
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

