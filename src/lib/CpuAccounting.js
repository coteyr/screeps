/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-04-03 22:53:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-04-03 23:15:54
*/

'use strict';
class CpuAccounting {
  static accountFor(tag, func, scope = null, args = []) {
    let start = Game.cpu.getUsed();
    let retValue = func.apply(scope, args);
    let end = Game.cpu.getUsed()
    Storage.addStat('account-cpu-' + tag, end - start)
    return retValue
  }
}
