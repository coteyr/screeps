/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 10:05:37
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-05 20:50:42
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
    300: [WORK, CARRY, MOVE],
    350: [WORK, WORK, CARRY, MOVE, MOVE],
    400: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    450: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    500: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    550: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
    550: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
    600: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
    650: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
  }

}
