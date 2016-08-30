/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-29 05:07:07
*/

'use strict';


Creep.prototype.assignTravelExoScoutTasks = function() {
  if(this.mode() !== 'transition') {
    this.setMode('leave')
  }
}

Creep.prototype.setupExoScoutMemory = function() {
  this.chooseExoTarget('scout')
}


Creep.prototype.assignHomeExoScoutTasks = function() {
  this.setMode('leave');
}

Creep.prototype.assignRemoteExoScoutTasks = function() {
  if(this.mode() === 'transition') {
    // this.setMode('mine')
  } else {
    this.setMode('scout')
  }
}

Creep.prototype.doScout = function() {
  if(this.room.controller) {
    this.moveCloseTo(this.room.controller.pos.x, this.room.controller.pos.y, 2)
  } else {
    this.moveCloseTo(25, 25, 5)
  }
  var home = Game.rooms[this.memory.home]
  if(this.room.controller){
    if(!this.room.controller.reservation || this.room.controller.reservation.ticksToEnd < 2500) {
      this.autoAddExo('reserve', home, this.room)
    }
    if(this.room.controller.reservation && this.room.controller.reservation.ticksToEnd > 4000) {
      this.autoRemoveExo('reserve', home, this.room)
    }
  }
  if(this.room.needsConstruction()) {
    this.autoAddExo('build', home, this.room)
  } else {
    this.autoRemoveExo('build', home, this.room)
  }
  if(!this.room.needsConstruction() && this.room.hasRoads()) {
    this.autoAddExo('mine', home, this.room)
    this.autoAddExo('carry', home, this.room)
    this.autoRemoveExo('harvest', home, this.room)
  } else {
    this.autoRemoveExo('mine', home, this.room, Finder.findSourceCount(this.room.name))
    this.autoRemoveExo('carry', home, this.room, Finder.findSourceCount(this.room.name))
    this.autoAddExo('harvest', home, this.room, Finder.findSourceCount(this.room.name))
  }
  if(Finder.hasHostals(this.room.name)) {
    this.autoAddExo('responder', home, this.room)
    Log.alert("Hostiles Spotted", this.room, this)
  } else {
    this.autoRemoveExo('responder', home, this.room)
  }
}

Creep.prototype.autoAddExo = function(arrayName, home, room, count = 1) {
  var existing = home.memory[arrayName].reduce(function(total,x){return x== room.name ? total+1 : total}, 0)
  if(existing < count){
    home.addExoTarget(arrayName, room.name)
    Log.warn('Adding ' + arrayName + ' from ' + home.name + " to " + room.name)
  }
}
Creep.prototype.autoRemoveExo = function(arrayName, home, room) {
  if(_.indexOf(home.memory[arrayName], room.name) > -1){
    home.removeExoTarget(arrayName, room.name)
    Log.warn('Removing ' + arrayName + ' from ' + home.name + " to " + room.name)
  }
}

