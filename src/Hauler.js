/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 10:23:42
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-02 17:58:57
*/

'use strict';

Creep.prototype.assignHaulerTasks = function() {
  if(this.mode() === 'idle') {
    if (_.sum(this.carry) < this.carryCapacity) {
      this.setMode('grab')
    } else {
      this.setMode('dump')
    }
  }
}
Creep.prototype.doGrab = function() {
  var droped = Finder.findDropedMinirals(this.room.name)
  if(_.size(droped) > 0) {
    if(this.moveCloseTo(droped[0].pos.x, droped[0].pos.y, 1)) {
      this.pickup(droped[0])
      this.setMode('idle')
    }
    return true
  }
  if(!this.memory.target) {
    this.memory.target = Finder.findResouceCache(this.room.name, this.pos)
  }
  var target = Game.getObjectById(this.memory.target.id)
  if(target) {
    var creep = this
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) {
      Object.keys(target.store).forEach(function(key, index) {
        creep.withdraw(target, key)
      }, target.store);
      delete this.memory.target
      this.setMode('dump')
    }
  }
  if(_.sum(this.carry) >= this.carryCapacity) {
    delete this.memory.target
    this.setMode('dump')
  }
}

Creep.prototype.doDump = function() {
  var creep = this
  if(!this.memory.target) {
    this.memory.target = Finder.findStorage(this.room.name)
  }
  var target = Game.getObjectById(this.memory.target.id)
  if(target) {
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) {
      Object.keys(this.carry).forEach(function(key, index) {
        creep.transfer(target, key)
      }, this.carry);
      delete this.memory.target
      this.setMode('grab')
    }
  }
}
