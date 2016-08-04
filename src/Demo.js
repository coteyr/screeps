/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-03 21:35:18
*/

'use strict';

Creep.prototype.assignDemoTasks = function() {
  if(this.isEmpty()) this.setMode('demo')
  if(this.isFull()) this.setMode('upgrade')
  if(_.size(this.room.memory.demos) <= 0) this.setMode('recycle')
}


Creep.prototype.doDemo = function() {
  if(this.needsTarget()) this.setTarget(this.room.memory.demos[0])
  if(this.hasTarget()) {
    var target = this.target()
    this.getCloseAndAction(target, this.dismantle(target), 1)
  } else {
    this.room.removeDemo(this.room.memory.demos[0])
    this.clearTarget()
    this.setMode('idle')
  }
  if(this.isFull()) this.setMode('upgrade')
}


