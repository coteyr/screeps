/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 03:29:20
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-05-13 19:01:29
*/

'use strict';



Creep.prototype.minerTick = function(){
  if(this.hasTarget('mine')) {
    this.mine(this.getTarget('mine'))
  } else {
    if(!this.setTarget('mine', Targeting.openSource(this.room))){
      Visualizer.circle(this, Config.colors.red)
    }
  }
}

Creep.prototype.mine = function(target){
  this.work(this.harvest, target, 1)
  if(this.room.level() >= 6) {
    this.useLinks()
  } else {
    this.drop(RESOURCE_ENERGY)
  }
}

Creep.prototype.useLinks = function() {
  if(!this.hasTarget('link')) {
    this.setTarget('link', Targeting.closeLink(this.room, this.pos))
  }
  let link = this.getTarget('link')
  if(link && this.hasEnergy()) this.dump(link)
}

