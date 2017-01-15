/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-15 08:49:10
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-01-15 08:52:13
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

}
