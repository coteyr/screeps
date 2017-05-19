/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-03-30 22:55:47
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-31 15:25:49
*/

'use strict';

class Hud {
  constructor() {
    this.lines = []
  }
  addLine(title, value, total, color = Config.colors.white) {
    this.lines.push({name: title, value: value, total: total, color: color})
  }
  display() {
    let position = 0
    let visual = new RoomVisual()
    visual.rect(0, 0, 18, _.size(this.lines) + 1, {fill: '#000000', opacity: 1})
    _.each(this.lines, l=> {
      position ++
      // visual.text(l.name, 1, position + 0.5)
      let pct = (l.value / l.total) * 10
      if (_.isNull(l.color)) l.color = Hud.colorize(pct)
      if (l.color === true) l.color = Hud.colorize(10 - pct)
      visual.text(l.name, 1, position, { align: 'left' })
      visual.rect(7, position - 0.5,  10, 0.5, {fill: Config.colors.gray})
      visual.rect(7, position - 0.5,  pct, 0.5, {fill: l.color, opacity: 1})
      visual.text(l.value.toFixed(0) + '/' + l.total.toFixed(0), 7 + (pct / 2), position - 0.1, {font: 0.5, align: 'left', color: '#000000'})
    })

  }
  static colorize(pct) {
    if (pct >= 0 && pct < 3) return Config.colors.green
    if (pct >= 3 && pct < 6) return Config.colors.blue
    if (pct >= 6 && pct < 8) return Config.colors.yellow
    return Config.colors.red
  }

}
