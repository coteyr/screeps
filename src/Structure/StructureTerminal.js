/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-27 05:12:04
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-05-02 10:43:34
*/

'use strict';
StructureTerminal.prototype.tick = function() {
  if(this.isFull()) {
    Log.warn("Terminal Full need to sell", this)
    this.sellGoods()
  }
}
StructureTerminal.prototype.isFull = function(){
  return _.sum(this.store) >= this.storeCapacity
}
StructureTerminal.prototype.sellGoods = function() {
  let orders = Market.getBuys(this.room, RESOURCE_ENERGY, 50)
  let amount = 0.90 * this.store[RESOURCE_ENERGY]
  let order = null
  let minCost = 0.10 * amount
  let realAmount = 0
  _.each(orders, o => {
    let tAmount = o.amount
    if(tAmount > amount) tAmount = amount
    let cost = Game.market.calcTransactionCost(tAmount, this.room.name, o.roomName) / tAmount
    Log.info(["Cost:", cost, "Amount:", tAmount])
    if(cost < minCost){
      order = o
      minCost = cost
      realAmount = tAmount
    }})
  if(order) {
    Game.market.deal(order.id, realAmount, this.room.name)
    Log.info("Energy Dump Order Complete.", this)
  } else {
    Log.error("No valid orders detected. Can not dump energy!", this)
  }
}
