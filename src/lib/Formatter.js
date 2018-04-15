/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-10 20:35:32
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-12 02:38:53
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
    try {
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
    } catch(e) {
      return json;
    }
  }
  static toFixed(value){
    let attempt = parseFloat(value)
    if(Number.isNaN(attempt)) {
      return "0.00"
    } else {
      return attempt.toFixed(2)
    }
  }
  static localTimeString(date) {
    let utc = date.getTime() + (date.getTimezoneOffset() * 60000)
    return new Date(utc + (60000 * Config.l10n.timeZoneOffset)).toLocaleString()
  }

}
