/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-29 19:38:13
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-02 22:24:00
*/

'use strict';

StructureController.prototype.safeModeTill = function() {
  if(this.safeMode) {
    let color = Config.colors.blue
    if (this.safeMode < 500)  color = Config.colors.red
    if (this.safeMode < 2000) color = Config.colors.yellow
    let time = new Time()
    return Formatter.color(color, Formatter.localTimeString(time.timeAtTick(time.gameTime + this.safeMode)))
  }
  return "Not in Safe Mode"
}

StructureController.prototype.tick = function() {
  this.displayNextLevelTimer()
}

StructureController.prototype.displayNextLevelTimer = function() {
  let dierction = 'downgrade'

}
