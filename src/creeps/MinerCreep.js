/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:15
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-07-03 15:13:31
*/

'use strict';
let MinerCreep = function() {}
MinerCreep.prototype.mine = function() {
  if(this.hasTarget()) {
      this.harvest(this.target())
    } else {
      this.setTarget(Targeting.findOpenSourceSpot(this.room.name))
    }
}



