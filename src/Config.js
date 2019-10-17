/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 10:05:37
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-07-03 01:41:37
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
  walls: {
    1: 1,
    2: 2,
    3: 3,
    4: 1000000,
    5: 3000000,
    6: 10000000
  },
  ramparts: {
    1: 1,
    2: 2,
    3: 3,
    4: 1000000,
    5: 3000000,
    6: 10000000
  },
  miners: {
    1: 2,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1
  },
  haulers: {
    1: 0,
    2: 2,
    3: 2,
    4: 2,
    5: 2,
    6: 2
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
    3: 1,
    4: 1,
    5: 1,
    6: 1,
    7: 1,
    8: 1
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
    defender: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    small: {body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK], size: 5},
    tiny: {body: [MOVE, ATTACK], size: -1},
    rapid: {body: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE], size: -1},
    deny: {body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, HEAL, ATTACK, RANGED_ATTACK], size: 5},
    claimer: [CLAIM, CLAIM, MOVE, MOVE],
    recovery: [WORK, CARRY, MOVE],
    default: [WORK, CARRY, MOVE],
    linker: [CARRY, MOVE],
    extractor: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
    swarmer: [MOVE, ATTACK],
    miner: {
      300: [WORK, WORK, MOVE],
      500: [WORK, WORK, WORK, MOVE],
      550: [WORK, WORK, WORK, WORK, WORK, MOVE],
      2300: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE]
    },
    hauler: {
      300: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
      350: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
      400: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
      500: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
      600: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      700: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
      1000: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    upgrader: {
      300: [CARRY, CARRY, WORK, MOVE, MOVE],
      350: [CARRY, CARRY, WORK, MOVE, MOVE, MOVE],
      500: [CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
      800:  [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
    },
    waller: {
      1200: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
      1700: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK,  WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    },
    builder: {
      300: [CARRY, CARRY, WORK, MOVE, MOVE],
      1250: [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    attacker: {
      1300: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
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
      5: 50000,
      6: 100000,
      7: 150000,
      8: 2000000
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
