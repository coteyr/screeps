/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-15 07:54:37
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-01-15 09:46:10
*/

'use strict';

class Time {
  constructor() {
    this.tickTime = 0
    this.samples = Storage.read('timeSamples', 0)
    this.offset = Config.l10n.timezoneOffset
    this.now = new Date()
    this.gameTime = Game.time
    this.compaireTimes()
  }
  currentTime() {
    return this.now
  }
  currentTimeString() {
    return Formatter.localTimeString(this.now)
  }
  gameTime() {
    return this.gameTime
  }
  averageTickTime(){
    return this.tickTime / 1000
  }
  compaireTimes(){
    let previousTick = Storage.read('lastTick', this.GameTime)
    let previousTime = Storage.read('lastTime', this.now)
    let ticks =  this.gameTime - previousTick
    let msecs = this.now.getTime() - new Date(previousTime).getTime()
    this.tickTime = this.calculateAverageTicks( msecs/ticks )
    this.storeTickAvrages()
    Storage.write('lastTick', this.gameTime)
    Storage.write('lastTime', this.now)
  }
  calculateAverageTicks(tickT){
    if(this.samples > 100) {
      this.samples = 0
      return tickT
    } else {
      return ((this.samples * Storage.read('averageTickTime', 0)) + tickT) / (this.samples + 1)
    }
  }
  storeTickAvrages() {
      Storage.write('timeSamples', this.samples + 1)
      Storage.write('averageTickTime', this.tickTime)
  }
  timeTillTick(tick){
    return (tick - this.gameTime) * this.tickTime
  }
  timeAtTick(tick) {
    return new Date(this.now.getTime() + this.timeTillTick(tick))
  }
}
