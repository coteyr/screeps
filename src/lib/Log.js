/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-10 20:34:36
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-12 02:36:51
*/

'use strict';
class Log {
  static info(message, object = null) {
    if (Config.logLevel >= 4) Log.output(Config.colors.white, message, object)
  }
  static warn(message, object = null) {
    if (Config.logLevel >= 2) Log.output(Config.colors.yellow, message, object)
  }
  static error(message, object = null) {
    if (Config.logLevel >= 1) Log.output(Config.colors.red, message, object)
  }
  static debug(message, object = null) {
    if (Config.logLevel >= 3) Log.output(Config.colors.gray, message, object)
  }
  static print(message, name = null) {
    if (Config.logLevel >= 0) Log.output(Config.colors.white, message, name)
  }
  static feedback(message, name = null) {
    Log.output(Config.colors.blue, message, name)
  }
  static tick(){
    console.log(Formatter.build([Formatter.color(Config.colors.purple, "Tick:"),  Formatter.color(Config.colors.green, Game.time)]))
  }
  static output(color, message, object = null) {
    let name = null
    if(!_.isNull(object)) {
      if(!_.isUndefined(object.name)) {
        name = object.name
      } else {
        name = object
      }
    }
    if (_.isArray(message)) message = Formatter.build(message)
    if (!_.isString(message)) message = Formatter.jsonSyntaxHighlight(message)
    if (name) message = Formatter.build([Formatter.color(Config.colors.blue, name), Formatter.color(Config.colors.gray, '::'), message])
    console.log(Formatter.size(Config.fonts.size, Formatter.font(Config.fonts.mono, Formatter.color(color, message))))
    // console.log("<span style=' font-family: " + Config.fonts.mono + "; font-size: " + Config.fonts.size + "; color: " + color + "'>" + message + '</span>')
  }
  static json(object) {
    console.log(Formatter.jsonSyntaxHighlight(object))
  }
}
