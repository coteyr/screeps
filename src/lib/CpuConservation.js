/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-03-18 00:05:22
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-18 00:08:26
*/

'use strict';

class CpuConservation {
  static haveCpu() {
    return Game.cpu.getUsed() < (0.90 * Game.cpu.limit)
  }
  static haveBucket() {
    return Game.cpu.getUsed() < (Game.cpu.tickLimit * 0.90) && Game.cpu.bucket > 50
  }
}
