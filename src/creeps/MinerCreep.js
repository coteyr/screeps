/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:15
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-03 18:42:31
*/

'use strict';
let MinerCreep = function() {}
MinerCreep.prototype.superTick = function() {
    Log.warn(["Creep", this.name, "has no tasks"])
  }

