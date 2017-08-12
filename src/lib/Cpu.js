/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-06-28 22:13:52
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-06-28 22:15:45
*/

'use strict';
class Cpu {
  constructor() {
    this.start = Game.cpu.getUsed()
  }
  usedCpu() {
    return Game.cpu.getUsed() - this.start
  }
  limit() {
    return Game.cpu.limit
  }
}
