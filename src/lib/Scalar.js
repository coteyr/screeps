/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-18 13:17:52
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-18 14:56:18
*/

'use strict';
class Scalar {
  static smallest(collection, method) {
    let smallest = Number.MAX_SAFE_INTEGER
    let value = null
    _.each(collection, item => {
      if(item.apply(method)< smallest)
        smallest = item.apply(method)
        value = item
    })
    return value
  }
  static largest(collection, method) {
    let largest = Number.MIN_SAFE_INTEGER
    let value = null
    _.each(collection, item => {
      if(item.apply(method) > largest)
        largest = item.apply(method)
        value = item
    })
    return value
  }
  static inBounds(pos, roomName) {
    let room = Game.rooms[roomName]
    if(_.isUndefined(room.memory.top) || is_Undefined(room.memory.bottom) || _.isUndefined(room.memory.left) || _.isUndefined(room.memory.right)) return true
    return pos.x > room.memory.left && pos.x < room.memory.right && pos.y > room.memory.top && pos.y < room.memory.bottom
  }
}
