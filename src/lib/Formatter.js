/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 09:51:44
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-01-15 09:11:10
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
    return "<span style='" + css[0] +": " + css[1] + "; '>" + text + "</span>"
  }
  static build(messages) {
    return messages.join(' ')
  }
  static jsonSyntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var color = Config.colors.green //'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
            color = Config.colors.purple; //key
        } else {
            color = Config.colors.grey; // 'string';
        }
      } else if (/true|false/.test(match)) {
          color = Config.colors.yellow; //boolean
      } else if (/null/.test(match)) {
          color = Config.colors.red; //'null';
      }
      return Formatter.wrap(['color', color], match)//'<span class="' + cls + '">' + match + '</span>';
    });
  }
  static toFixed(value){
    let attempt = parseFloat(value)
    if(Number.isNaN(attempt)) {
      return "0.00"
    } else {
      return attempt.toFixed(2)
    }
  }

}
