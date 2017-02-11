/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 10:05:37
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-10 04:21:00
*/

'use strict';

var Config = {
  logLevel: 4,
  colors: {
    yellow: '#ffe56d',
    gray: '#777777',
    red: '#f93842',
    blue: '#5d80b2;',
    green: '#65fd62',
    purple: '#b99cfb',
    white: '#ffffff'
  },
  fonts: {
    mono: 'Menlo,Monaco,Consolas,"Courier New",monospace',
    sans: 'Helvetica, Arial, sans-serif',
    size: '14px'
  },
  l10n: {
    timeZoneOffset: -300
  },
  bodies: {
    default: [WORK, CARRY, MOVE],
    300:  [WORK, CARRY, MOVE],
    350:  [WORK, WORK, CARRY, MOVE, MOVE],
    400:  [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    450:  [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    500:  [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    550:  [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
    600:  [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    650:  [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    700:  [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    750:  [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    800:  [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    850:  [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    900:  [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    950:  [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
    1000: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
    1050: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
    1100: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
    1150: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
    1200: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
  },
  wallSpacing: 4,
  maxConstructionSites: 10,
  tower: {
    criticalEnergy: 200,
    dangerEnergy: 300,
    repairPercent: 10,
    walls: {
      1: 1,
      2: 1,
      3: 5000,
      4: 10000,
      5: 100000,
      6: 1000000,
      7: 2000000,
      8: 3000000
    }
  }

}
