/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-27 05:07:50
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-27 05:11:38
*/

'use strict';

class Market {
  static getBuys(room, resource, maxDistance = 20) {
    let orders = Game.market.getAllOrders(order => order.resourceType == resource &&
      order.type == ORDER_BUY &&
      Game.map.getRoomLinearDistance(order.roomName, room.name, true) < maxDistance)
    return orders;
  }
}
