/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 09:51:44
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-01-19 19:22:49
*/

'use strict';

class Log {
  static info(message) {
    if (Config.logLevel >= 4) Log.output(Config.colors.white, message)
  }
  static warn(message) {
    if (Config.logLevel >= 2) Log.output(Config.colors.yellow, message)
  }
  static error(message) {
    if (Config.logLevel >= 1) Log.output(Config.colors.red, message)
  }
  static debug(message) {
    if (Config.logLevel >= 3) Log.output(Config.colors.gray, message)
  }
  static print(message) {
    if (Config.logLevel >= 0) Log.output(Config.colors.white, message)
  }
  static tick(){
    console.log(Formatter.build([Formatter.color(Config.colors.purple, "Tick:"),  Formatter.color(Config.colors.green, Game.time)]))
  }
  static output(color, message) {
    console.log(Formatter.size(Config.fonts.size, Formatter.font(Config.fonts.mono, Formatter.color(color, message))))
    // console.log("<span style=' font-family: " + Config.fonts.mono + "; font-size: " + Config.fonts.size + "; color: " + color + "'>" + message + '</span>')
  }
  static json(object) {
    console.log(Formatter.jsonSyntaxHighlight(object))
  }
}
