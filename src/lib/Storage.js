/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-15 08:49:10
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-31 00:00:22
*/

'use strict';

class Storage {
  static write(key, value) {
    if(!Memory.globals) Memory.globals = {}
    Memory.globals[key] = value
  }
  static read(key, defaultValue) {
    if(!Memory.globals) Memory.globals = {}
    if(!Memory.globals[key]) return defaultValue
    return Memory.globals[key]
  }
  static readStat(key, defaultValue) {
    if(_.isUndefined(STATS)) STATS = {}
    if(_.isUndefined(STATS[key])) STATS[key] = defaultValue
    return STATS[key]
  }
  static writeStat(key, value) {
    if(_.isUndefined(STATS)) STATS = {}
    STATS[key] = value
    return value
  }
  static addStat(key, amount = 1) {
    Storage.writeStat(key, Storage.readStat(key, 0) + amount)
    return Storage.readStat(key, amount)
  }
  static clearStat(key) {
    return delete STATS[key]
  }

}
