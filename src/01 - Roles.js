/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-15 16:33:03
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-15 16:35:44
*/

'use strict';

var ROLES = [

]

var EXOROLES = [
  { role: 'exo-attacker',  arrayName: 'attack',  multiplyer: 10, priority: 10, body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE] },
  { role: 'exo-builder',   arrayName: 'build',   multiplyer: 4,  priority: 30, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] },
  { role: 'exo-harvester', arrayName: 'harvest', multiplyer: 4,  priority: 20, body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] },
  { role: 'exo-claimer',   arrayName: 'claim',   multiplyer: 1,  priority: 10, body: [CLAIM, CLAIM, MOVE, MOVE] },
  { role: 'exo-reserver',  arrayName: 'reserve', multiplyer: 1,  priority: 10, body: [CLAIM, CLAIM, MOVE, MOVE] },
  { role: 'exo-theif',     arrayName: 'steal',   multiplyer: 2,  priority: 20, body: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]}
]

module.exports = ROLES, EXOROLES;
