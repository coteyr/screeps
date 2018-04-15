/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 10:05:37
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-14 07:05:31
*/

'use strict';

var Config = {
  logLevel: 4,
  showOverlay: false,
  showHud: true,
  defaultRange: 1,
  upgradeRange: 2,
  buildRange: 1,
  colors: {
    yellow: '#ffe56d',
    gray: '#777777',
    red: '#f93842',
    blue: '#5d80b2',
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
  miners: {
    1: 2,
    2: 2,
    3: 2,
    4: 1,
    5: 1
  },
  haulers: {
    1: 0,
    2: 2,
    3: 2,
    4: 2,
    5: 2
  },
  upgraders: {
    1: 4,
    2: 4,
    3: 3,
    4: 2,
    5: 2,
    6: 2,
    7: 2,
    8: 2
  },
  builders: {
    1: 1,
    2: 1,
    3: 2,
    4: 2,
    5: 2,
    6: 2,
    7: 2,
    8: 2
  },
  wallers: {
    1: 0,
    2: 0,
    3: 0,
    4: 2,
    5: 2,
    6: 2,
    7: 2,
    8: 2
  },
  bodies: {
    small: {body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK], size: 5},
    tiny: {body: [MOVE, ATTACK], size: -1},
    rapid: {body: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE], size: -1},
    deny: {body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, HEAL, ATTACK, RANGED_ATTACK], size: 5},
    claim: [CLAIM, CLAIM, MOVE, MOVE],
    recovery: [WORK, CARRY, MOVE],
    default: [WORK, CARRY, MOVE],
    miner: {
      300: [WORK, WORK, MOVE],
      350: [WORK, WORK, MOVE],
      400: [WORK, WORK, MOVE],
      450: [WORK, WORK, MOVE],
      500: [WORK, WORK, WORK, MOVE],
      550: [WORK, WORK, WORK, WORK, WORK, MOVE],
      600: [WORK, WORK, WORK, WORK, WORK, MOVE],
      650: [WORK, WORK, WORK, WORK, WORK, MOVE],
      700: [WORK, WORK, WORK, WORK, WORK, MOVE],
      750: [WORK, WORK, WORK, WORK, WORK, MOVE],
      800: [WORK, WORK, WORK, WORK, WORK, MOVE],
      850: [WORK, WORK, WORK, WORK, WORK, MOVE],
      900: [WORK, WORK, WORK, WORK, WORK, MOVE],
      950: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1000: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1050: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1100: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1150: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1200: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1250: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1300: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1350: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1400: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1450: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1500: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1550: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1650: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1700: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1750: [WORK, WORK, WORK, WORK, WORK, MOVE],
      1800: [WORK, WORK, WORK, WORK, WORK, MOVE],

    },
    hauler: {
      300: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
      350: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
      400: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
      450: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
      500: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
      550: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
      600: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      650: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      700: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      750: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
      800: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      850: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      900: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      950: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1000: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1050: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1100: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1150: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1200: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1250: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1300: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1350: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1400: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1450: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1500: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1550: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1600: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1650: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1700: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1750: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1800: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    },
    upgrader: {
      300: [CARRY, CARRY, WORK, MOVE, MOVE],
      350: [CARRY, CARRY, WORK, MOVE, MOVE, MOVE],
      400: [CARRY, CARRY, WORK, MOVE, MOVE, MOVE],
      450: [CARRY, CARRY, WORK, MOVE, MOVE, MOVE],
      500: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      550: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      600: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      650: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      700: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      750: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      800: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      850: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      900: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      950: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1000: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1050: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1100: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1150: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1200: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1250: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1300: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1350: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1400: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1450: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1500: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1550: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1600: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1650: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1700: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1750: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      1800: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
    },
    waller: {
      1200: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
      1700: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK,  WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    builder: {
      300: [CARRY, CARRY, WORK, MOVE, MOVE],
      350: [CARRY, CARRY, WORK, MOVE, MOVE],
      400: [CARRY, CARRY, WORK, MOVE, MOVE],
      450: [CARRY, CARRY, WORK, MOVE, MOVE],
      500: [CARRY, CARRY, WORK, MOVE, MOVE],
      550: [CARRY, CARRY, WORK, MOVE, MOVE],
      600: [CARRY, CARRY, WORK, MOVE, MOVE],
      650: [CARRY, CARRY, WORK, MOVE, MOVE],
      700: [CARRY, CARRY, WORK, MOVE, MOVE],
      750: [CARRY, CARRY, WORK, MOVE, MOVE],
      800: [CARRY, CARRY, WORK, MOVE, MOVE],
      850: [CARRY, CARRY, WORK, MOVE, MOVE],
      900: [CARRY, CARRY, WORK, MOVE, MOVE],
      950: [CARRY, CARRY, WORK, MOVE, MOVE],
      1000: [CARRY, CARRY, WORK, MOVE, MOVE],
      1050: [CARRY, CARRY, WORK, MOVE, MOVE],
      1100: [CARRY, CARRY, WORK, MOVE, MOVE],
      1150: [CARRY, CARRY, WORK, MOVE, MOVE],
      1200: [CARRY, CARRY, WORK, MOVE, MOVE],
      1250: [CARRY, CARRY, WORK, MOVE, MOVE],
      1300: [CARRY, CARRY, WORK, MOVE, MOVE],
      1350: [CARRY, CARRY, WORK, MOVE, MOVE],
      1400: [CARRY, CARRY, WORK, MOVE, MOVE],
      1450: [CARRY, CARRY, WORK, MOVE, MOVE],
      1500: [CARRY, CARRY, WORK, MOVE, MOVE],
      1550: [CARRY, CARRY, WORK, MOVE, MOVE],
      1600: [CARRY, CARRY, WORK, MOVE, MOVE],
      1650: [CARRY, CARRY, WORK, MOVE, MOVE],
      1700: [CARRY, CARRY, WORK, MOVE, MOVE],
      1750: [CARRY, CARRY, WORK, MOVE, MOVE],
      1800: [CARRY, CARRY, WORK, MOVE, MOVE],
    },

    "remote-builder": {
      1300: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1350: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1400: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1450: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1500: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1550: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1600: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1650: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1700: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1750: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1800: [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    },
    attacker: {
      1300: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1350: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1400: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1450: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1500: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1550: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1600: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1650: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1700: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1750: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1800: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE,MOVE,MOVE,MOVE,MOVE, MOVE,MOVE,MOVE,MOVE,MOVE, MOVE,MOVE,MOVE,MOVE,MOVE]
    },
    bait: {
      1800: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    medic: {
      1800: [MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL]
    },
    dumper: {
      1800: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    swarmer: {
      300: [MOVE, ATTACK]
    },
    dancer: {
      1000: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    guard: {
      1800: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE]
    }
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
  },
  minEnergy: {
    1: 25,
    2: 50,
    3: 75,
    4: 200,
    5: 200,
    6: 200,
    7: 250,
    8: 300
  }

}
