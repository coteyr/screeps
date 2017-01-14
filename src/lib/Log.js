/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 09:51:44
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-01-14 11:02:43
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
    console.log(Formatter.build([Formatter.color(Config.colors.purple, "Tick:"),  Formatter.color(Config.colors.green, Game.time)]))
  }
  static output(color, message) {
    console.log(Formatter.size(Config.fonts.size, Formatter.font(Config.fonts.mono, Formatter.color(color, message))))
    // console.log("<span style=' font-family: " + Config.fonts.mono + "; font-size: " + Config.fonts.size + "; color: " + color + "'>" + message + '</span>')
  }
  static write(messages){
    console.log(messages.join(' '))
  }


}
