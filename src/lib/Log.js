/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 09:51:44
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-01-14 10:44:49
*/

'use strict';

class Log {
  static info(message) {
    Log.output(Config.colors.white, message)
  }
  static warn(message) {
    Log.output(Config.colors.yellow, message)
  }
  static error(message) {
    Log.output(Config.colors.red, message)
  }
  static debug(message) {
    Log.output(Config.colors.gray, message)
  }
  static tick(){
    console.log(Formatter.color(Config.colors.purple, "Tick: ") + Formatter.color(Config.colors.green, Game.time))
   // Log.output(Config.colors.purple, "Tick: " + Game.time)
  }
  static output(color, message) {
   // console.log(Formatter.size(Config.fonts.size, Formatter.font(Config.fonts.mono), Formatter.color(color), message))
    // console.log("<span style=' font-family: " + Config.fonts.mono + "; font-size: " + Config.fonts.size + "; color: " + color + "'>" + message + '</span>')
  }


}
