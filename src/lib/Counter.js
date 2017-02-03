/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-02 22:46:08
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-02 22:47:46
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
