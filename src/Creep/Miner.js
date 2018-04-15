/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 03:29:20
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-12 04:09:14
*/

'use strict';



Creep.prototype.minerTick = function(){
  if(this.hasTarget('mine')) {
    this.mine(this.getTarget('mine'))
  } else {
    if(!this.setTarget('mine', Targeting.openSource(this.room))){
      Log.error("Failed to set mining Target!", this)
    }
  }
}

Creep.prototype.mine = function(target){
  this.work(this.harvest, target, 1)
}
