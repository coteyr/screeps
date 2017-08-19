/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-19 07:36:06
*/

'use strict';

let RemoteBuilderCreep = function() {}
RemoteBuilderCreep.prototype.remoteBuilder = function() {
  if(this.gotoTargetRoom()) {
    this.chooseFillStatus()
    if(this.memory.status === 'fill') {
      this.harvest()
    } else {
      this.build()
    }
  }
}




