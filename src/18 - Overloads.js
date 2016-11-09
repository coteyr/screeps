/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-11-04 15:57:48
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-04 17:12:28
*/

'use strict';

Creep.prototype.orignalHarvest = Creep.prototype.harvest

Creep.prototype.harvest = function(target) {
  var did = this.orignalHarvest(target)
  if(did === 0) {
    var count = this.countPart('work')
    Memory.harvest_this_tick += count * 2
    Reporting.accountAction('harvest', this.room.name, count * 2)
  }

  return did
}

Creep.prototype.orignalMoveTo = Creep.prototype.moveTo

Creep.prototype.moveTo = function(first, second, options) {
  if(this.hasPart(WORK) && this.hasSome()) {
    var road = Targeting.findRoadUnderneath(this.pos)
    if(road && road.hits < road.hitsMax) this.repair(road)
  }
  this.orignalMoveTo(first, second, options)
}

Creep.prototype.originalUpgradeController = Creep.prototype.upgradeController

Creep.prototype.upgradeController = function(target) {
  let did = this.originalUpgradeController(target)
  if(did === 0) {
    var count = this.countPart('work')
    Reporting.accountAction('RCL', this.room.name, count * 1)
  }
  return did
}

Creep.prototype.originalRepair = Creep.prototype.repair

Creep.prototype.repair = function(target) {
  let did = this.originalRepair(target)
  if(did === 0) {
    var count = this.countPart('work')
    Reporting.accountAction('Repair', this.room.name, count * 1)
  }
  return did
}

Creep.prototype.originalBuild = Creep.prototype.build

Creep.prototype.build = function(target) {
  let did = this.originalBuild(target)
  if(did === 0) {
    var count = this.countPart('work')
    Reporting.accountAction('Build', this.room.name, count * 5)
  }
  return did
}
