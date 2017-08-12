/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-06-28 22:18:46
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-06-28 22:38:56
*/

'use strict';
class Configurator {
  constructor() {

  }
  getValue(key, configKey = false) {
    let value = Storage.read("Config-" + key, null)
    if(value === null && configKey) value = configKey
    if(value !== null) Storage.write("Config-" + key, value)
    return value
  }
  setValue(key, value) {
    return Storage.write("Config-" + key, value)
  }
}
