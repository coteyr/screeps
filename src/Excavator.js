/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 02:56:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-04 00:08:53
*/

'use strict';

Creep.prototype.assignExcavatorTasks = function() {
  if(this.hasRoom()) this.setMode('excavate');
  if(this.isFull()) this.setMode('stash')
}

Creep.prototype.doExcavate = function() {
  if(this.needsTarget()) this.setTarget(Finder.findMineral(this.room.name))
  if(this.hasTarget()){
    var target = this.target()
    this.getCloseAndAction(target, this.harvest(target), 1)
  }
  if(this.isFull()) this.setMode('stash')
}

Creep.prototype.doStash = function() {
  var container = Targeting.findCloseContainer(this.pos, 1)[0]
  this.dumpResources(container)
}
