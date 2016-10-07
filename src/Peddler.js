/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 10:23:42
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-07 09:21:20
*/

'use strict';

// [check-dropped -> select -> position -> fill -> choose -> travel -> dump] -> recycle
//               |->        goto -> pickup      ->|

let PeddlerCreep = function() {}
_.merge(PeddlerCreep.prototype, EnergyHaulingCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype, LocalCreep.prototype);


PeddlerCreep.prototype.tickCreep = function() {
  this.localState()
  this.energyState()
  this.checkState()
  this.recycleState()
}

PeddlerCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('find-sale')
  if(this.stateIs('find-sale')) {
    this.findSale()
  }
  if(this.stateIs('position')) {
    var storage = Finder.findStorage(this.room.name)
    if(this.moveCloseTo(storage.pos.x, storage.pos.y, 1)) this.setState('pickup')
  }
  if(this.stateIs('pickup')) {
    var storage = Finder.findStorage(this.room.name)
    this.withdraw(storage, this.memory.resource)
    this.setState('transfer')
  }
  if(this.stateIs('transfer')) {
    if(this.moveCloseTo(this.room.terminal.pos.x, this.room.terminal.pos.y, 1)) this.setState('drop')
  }
  if(this.stateIs('drop')) {
    this.transfer(this.room.terminal, this.memory.resource)
    if(this.room.terminal.store[this.memory.resource] >= this.room.memory.sell[this.memory.resource].total) {
      this.setState('check-dropped')
    } else {
      this.setState('position')
    }
  }
  if(this.stateIs('choose')) {
    if(this.moveCloseTo(this.room.terminal.pos.x, this.room.terminal.pos.y, 1)) this.setState('giveCost')
  }
  if(this.stateIs('giveCost')) {
    this.transfer(this.room.terminal, RESOURCE_ENERGY)
    if(this.room.terminal.store[RESOURCE_ENERGY] > this.memory.cost){
      this.setState('execute')
    } else {
      this.setState('check-dropped')
    }
  }
  if(this.stateIs('execute')) {
    var result = Game.market.deal(this.memory.order, this.room.memory.sell[this.memory.resource].total, this.room.name)
    Log.info('Market Transaction: ' + result, this.room, this)
    if(result === 0) {
      delete this.room.memory.sell[this.memory.resource]
      if(_.sum(this.room.terminal.store) > 0) {
        this.setState('empty')
      } else {
        this.setState('find-sale')
      }
    } if(result === -10) { /// Bad Args
      this.setState('find-sale')
    }
  }
  if(this.stateIs('empty')) {
    if(this.moveCloseTo(this.room.terminal.pos.x, this.room.terminal.pos.y, 1)) this.setState('clean')
  }
  if(this.stateIs('clean')) {
    let terminal = this.room.terminal
    let creep = this
     Object.keys(terminal.store).forEach(function(key, index) {
      if(terminal.store[key] > 0) creep.withdraw(terminal, key)
     }, terminal.store);
    this.setState('haul')
  }
  if(this.stateIs('haul')) {
    var storage = Finder.findStorage(this.room.name)
    if(this.moveCloseTo(storage.pos.x, storage.pos.y, 1)) this.setState('plop')
  }
  if(this.stateIs('plop')) {
    var storage = Finder.findStorage(this.room.name)
    this.dumpResources(storage)
    if(_.sum(this.room.terminal.store) > 0) {
      this.setState('empty')
    } else {
      this.setState('find-sale')
    }
  }
}

PeddlerCreep.prototype.findSale = function() {
  delete this.memory.order
  delete this.memory.cost
  delete this.memory.resource
  delete this.memory.transfered
  let room = Game.rooms[this.memory.home]
  let storage = Finder.findStorage(this.memory.home)
  let creep = this
  this.findResourceToSell()
  if(this.memory.resource) {
    let resource = this.memory.resource
    let orders =  Game.market.getAllOrders(function(o){
        return o.type === ORDER_BUY && o.resourceType === resource && o.remainingAmount >= room.memory.sell[resource].total
      })
    let max = 0
    var orderId
    var dest
    var cost = 0
    orders.forEach(function(order){
      // price / distance && price > 0.25
      let value = order.price / Game.map.getRoomLinearDistance(room.name, order.roomName)
      if(value > max) {
        max = value
        orderId = order.id
        dest = order.roomName
        cost = Game.market.calcTransactionCost(room.memory.sell[resource].total, creep.memory.home, dest)
      }
    })
    if(orderId) {
      creep.memory.order = orderId
      creep.memory.cost = cost
      creep.setState('position')
      return true
    }
  }
}
PeddlerCreep.prototype.findResourceToSell = function() {
  let room = Game.rooms[this.memory.home]
  let storage = Finder.findStorage(this.memory.home)
  let terminal = room.terminal
  let creep = this
  Object.keys(room.memory.sell).some(function(resource, index) {
    if(room.memory.sell[resource].total < storage.store[resource] || terminal.store[resource] >= room.memory.sell[resource].total) {
      creep.memory.resource = resource
      return true
    }
  }, room.memory.sell)
}

