/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-10-08 01:22:46
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-08 01:42:24
*/

'use strict';

let Reporting = {
  setValue: function(roomName, key, value){
    Memory.stats["room." + roomName + "." + key ] = value
  },
  setEmpireValue: function(key, value){
    Memory.stats["empire." + key ] = value
  }
}
