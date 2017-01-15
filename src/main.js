/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 09:43:31
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-01-15 09:09:09
*/

'use strict';



module.exports.loop = function () {
  Log.tick()
  let t = new Time()
  Log.info(t.currentTimeString())
  Log.info(Formatter.toFixed(t.averageTickTime()))
  Log.info(Formatter.toFixed('bug'))
}
