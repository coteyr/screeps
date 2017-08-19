/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-19 07:37:46
*/

'use strict';

let GaurdCreep = function() {}
GaurdCreep.prototype.gaurd = function() {
  if(this.gotoTargetRoom()) {
    GuardTactic.doAttack(this,this.room)
  }
}




