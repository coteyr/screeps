/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-18 13:17:52
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-06 20:57:15
*/

'use strict';
class Scalar {
  static bounder(collection, method, biggest = true) {
    let smallest = Number.MAX_SAFE_INTEGER
    let largest = Number.MIN_SAFE_INTEGER
    let smallValue = null
    let largeValue = null
    _.each(collection, i => {
      let value = i.apply(method)
      if(value < smallest) {
        smallest = value
        smallValue = i
      }
      if(value > largest) {
        largest = value
        largeValue = i
      }
    })
    if(biggest) return largeValue
    return smallValue
  }
  static smallest(collection, method) {
    return Scalar.bounder(collection, method, false)
  }
  static largest(collection, method) {
    return Scalar.bounder(collection, method, true)
  }
  static inBounds(pos, roomName) {
    let room = Game.rooms[roomName]
    if(RoomBuilder.needMainArea(roomName)) return true
    return pos.x > room.memory.left && pos.x < room.memory.right && pos.y > room.memory.top && pos.y < room.memory.bottom
  }
  static orderByPos(pos, collection) {
    return _.sortBy(collection, o => {
      return pos.getRangeTo(o.x, o.y)
    })
  }
}
