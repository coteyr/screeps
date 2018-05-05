/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 02:23:26
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-25 10:43:35
*/

'use strict';

class Math {
  static count(array) {
    if(_.isArray(array)) return array.length
    return 0
  }
  static getBody(array, energy) {
    let body = null
    while(!body && energy >= 300) {
      body = array[energy]
      energy = energy - 50
    }
    return body
  }
}
