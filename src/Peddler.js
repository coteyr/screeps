/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 10:23:42
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-05 18:29:22
*/

'use strict';

// [check-dropped -> select -> position -> fill -> choose -> travel -> dump] -> recycle
//               |->        goto -> pickup      ->|

let PeddlerCreep = function() {}
_.merge(PeddlerCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype, LocalCreep.prototype);


PeddlerCreep.prototype.tickCreep = function() {
  this.localState()
  this.checkState()
  this.recycleState()
}

PeddlerCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('find-sale')
  if(this.stateIs('find-sale')) {
    delete this.memory.order
    delete this.memory.cost
    delete this.memory.resource
    delete this.memory.transfered
    var room = Game.rooms[this.memory.home]
    var storage = Finder.findStorage(this.memory.home)
    var creep = this
    Object.keys(room.memory.sell).some(function(resource, index) {
        if(room.memory.sell[resource].total < storage.store[resource]) {
          creep.memory.resource = resource
          var orders = Game.market.getAllOrders(function(o){
            return o.type === ORDER_BUY && o.resourceType === resource && o.remainingAmount >= room.memory.sell[resource].total
          })
          var max = 0
          var orderId
          var dest
          var cost = 50000
          orders.forEach(function(o){
            if(o.price > max) {
              max = o.price
              orderId = o.id
              dest = o.roomName
              cost = Game.market.calcTransactionCost(room.memory.sell[resource].total, creep.memory.home, dest)
            } else if(o.price === max) {
              var tcost = Game.market.calcTransactionCost(room.memory.sell[resource].total, creep.memory.home, dest)
              if(tcost < cost) {
                max = o.price
                orderId = o.id
                dest = o.roomName
                cost = tcost
              }
            }
          })
          if(orderId) {
            creep.memory.order = orderId
            creep.memory.cost = cost
            creep.setState('position')
            return true
          }
        }
      }, room.memory.sell)
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
    if(!this.memory.transfered) this.memory.transfered = 0
    this.memory.transfered += this.carry[this.memory.resource]
    if(this.memory.transfered >= this.room.memory.sell[this.memory.resource].total) {
      this.setState('pay')
    } else {
      this.setState('position')
    }
  }
  if(this.stateIs('pay')) {
    var storage = Finder.findStorage(this.room.name)
    if(this.moveCloseTo(storage.pos.x, storage.pos.y, 1)) this.setState('getCost')
  }
  if(this.stateIs('getCost')) {
    var storage = Finder.findStorage(this.room.name)
    this.withdraw(storage, RESOURCE_ENERGY, Math.min(this.memory.cost, this.carryCapacity))
    this.setState('move')
  }
  if(this.stateIs('move')) {
    if(this.moveCloseTo(this.room.terminal.pos.x, this.room.terminal.pos.y, 1)) this.setState('giveCost')
  }
  if(this.stateIs('giveCost')) {
    this.transfer(this.room.terminal, RESOURCE_ENERGY)
    this.memory.cost -= this.carry.energy
    if(this.memory.cost <= 0) {
      this.setState('execute')
    } else {
      this.setState('pay')
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
    }
  }
  if(this.stateIs('empty')) {
    if(this.moveCloseTo(this.room.terminal.pos.x, this.room.terminal.pos.y, 1)) this.setState('clean')
  }
  if(this.stateIs('clean')) {
    this.withdraw(this.room.terminal, Object.keys(this.room.terminal.store)[0])
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

