/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-15 07:54:37
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-01-15 09:27:23
*/

'use strict';

class Time {
  constructor() {
    this.tickTime = 0
    this.samples = Storage.read('timeSamples', 0)
    this.offset = -300
    this.now = new Date()
    this.gameTime = Game.time
    this.compaireTimes()
  }
  currentTime() {
    return this.now
  }
  currentTimeString() {
    let utc = this.now.getTime() + (this.now.getTimezoneOffset() * 60000)
    return new Date(utc + (60000 * this.offset)).toLocaleString()
    //return this.now.getTimezoneOffset()
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
}
