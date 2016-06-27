/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:04:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 20:48:26
*/

'use strict';

Creep.prototype.tick = function(){
  Log.info('Ticking Creep: ' + this.name);
  if (this.memory.role == 'harvester') {
    this.assignHarvesterTasks()
  }
  this.doWork();
}

Creep.prototype.doWork = function() {
  if(this.memory.mode == 'mine') {
    this.doMine();
  } else if(this.memory.mode == "goto") {
    this.goto();
  } else if(this.memory.mode == 'store') {
    this.doStore();
  }
}

Creep.prototype.goto = function(x, y) {
  if(x) {
    this.memory.goto_x = x
  }
  if(y) {
    this.memory.goto_y = y
  }
  x = this.memory.goto_x
  y = this.memory.goto_y
  if (x == this.pos.x && y == this.pos.y) {
    this.memory.mode = this.memory.before_goto_mode || 'idle'
    delete this.memory.before_goto_mode
  } else {
    if (this.memory.mode == 'goto') {
      this.moveTo(x, y)
    } else {
      this.memory.before_goto_mode = this.memory.mode
      this.memory.mode = 'goto'
    }
  }
}
