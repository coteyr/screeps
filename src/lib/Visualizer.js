/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-03-06 21:01:32
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-06 21:07:34
*/

'use strict';


class Visualizer {
  static showSquares(roomName, positions, color) {
    let room = Game.rooms[roomName]
    _.each(positions, p => {
      room.visual.rect(s.x - 0.5, s.y - 0.5, 1, 1, { fill: color })
    })
  }
  static showCircles(roomName, positions, color, count = false) {
    let room = Game.rooms[roomName]
    let i = 0
    _.each(positions, p => {
      i++
      room.visual.circle(p.x, p.y, { fill: color })
      if(count) room.visual.text(i, p.x, p.y, {color: Config.colors.green, font: 0.25 })
    })
  }
}
