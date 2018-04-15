/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 02:59:04
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-12 02:59:22
*/

'use strict';
class Counter {
  static number() {
    let oldNumber = Storage.read('unique-id', 0)
    let newNumber = oldNumber + 1
    Storage.write('unique-id', newNumber)
    return newNumber
  }
}
