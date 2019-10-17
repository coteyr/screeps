/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 02:23:26
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-05-19 15:25:28
*/

'use strict';

class Maths {
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
  static randomDirection() {
    return Math.floor(Math.random() * 8) + 1;  // returns a number between 1 and 10
  }
  static bodyPoints(body) {
    let points = 0
    _.each(body, function(b) {
      points = points + BODYPART_COST[b.type]
    })
    return points
  }
}
