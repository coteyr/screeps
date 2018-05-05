/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-15 19:27:46
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-15 19:30:49
*/

'use strict';

Creep.prototype.claimerTick = function() {
  if(this.travel()) {
    this.work(this.claimController, this.room.controller, 1)
  }
 }
