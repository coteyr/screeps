/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-26 06:35:11
*/

'use strict';


Creep.prototype.setupExoDemoMemory = Creep.prototype.setupExoAttackerMemory
Creep.prototype.assignTravelExoDemoTasks =Creep.prototype.assignTravelExoAttackerTasks
Creep.prototype.assignHomeExoDemoTasks = Creep.prototype.assignHomeExoAttackerTasks
Creep.prototype.assignRemoteExoDemoTasks = function () {
  if (this.hits <= 500) {
      this.setMode('go-home')
    } else {
      this.setMode('steal')
    }

}
