/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 02:59:31
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-12 02:59:57
*/

'use strict';

class Storage {
  static write(key, value) {
    if(!Memory.globals) Memory.globals = {}
    Memory.globals[key] = value
    return value
  }
  static read(key, defaultValue) {
    if(!Memory.globals) Memory.globals = {}
    if(Memory.globals[key] === null) return defaultValue
    return Memory.globals[key]
  }
}
