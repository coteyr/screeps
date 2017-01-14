/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 09:51:44
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-01-14 10:45:29
*/

'use strict';

class Formatter {
  static color(color, text) {
    return Formatter.wrap(['color', color], text)
  }
  static size(size, text) {
    return Formatter.wrap(['font-size', size], text)
  }
  static font(family, text) {
    return Formatter.wrap(['font-family', family], text)
  }
  static wrap(css, text) {
    return "<span style='" + css[0] +": " + css[1] + "; " + "'>" + text + "</span>"
  }

}
