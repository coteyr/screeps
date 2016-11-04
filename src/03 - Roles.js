/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-15 16:33:03
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-02 08:25:50
*/

'use strict';
var ROLES = {
  roles: [
    {min: 300, max: 550, roles: [
      { role: 'harvester', priority: 1, body: {work: 1, carry: 2} },
      { role: 'builder',   priority: 2, body: {work: 1, carry: 1} },
      { role: 'upgrader',  priority: 4, body: {work: 1, carry: 1} },
      { role: 'miner',     priority: 2, body: {work: 1, carry: 1} },
      { role: 'repairer',  priority: 4, body: {work: 1, carry: 1} }
    ]},
    {min: 550, max: 800, roles: [
      { role: 'harvester', priority: 1, body: {work: 2, carry: 4} },
      { role: 'miner',     priority: 2, body: {work: 4, carry: 1, move: 1} },
      { role: 'carrier',   priority: 3, body: {carry: 5} },
      { role: 'builder',   priority: 4, body: {work: 2, carry: 2} },
      { role: 'upgrader',  priority: 4, body: {work: 2, carry: 2} },
      { role: 'demo',      priority: 5, body: {work: 3, carry: 1} },
      { role: 'repairer',  priority: 4, body: {work: 2, carry: 2} }
    ]},
    {min: 800, max: 1300, roles: [
      { role: 'harvester', priority: 1, body: {work: 4, carry: 3} },
      { role: 'miner',     priority: 2, body: {work: 5, carry: 1, move: 3} },
      { role: 'carrier',   priority: 3, body: {carry: 5} },
      { role: 'builder',   priority: 4, body: {work: 3, carry: 3} },
      { role: 'upgrader',  priority: 4, body: {work: 3, carry: 3} },
      { role: 'demo',      priority: 5, body: {work: 4, carry: 2} },
      { role: 'repairer',  priority: 4, body: {work: 4, carry: 4} },
      { role: 'rampart-d', priority: 0, body: {attack: 6, move: 3}},
      { role: 'wall-d',    priority: 0, body: {ranged: 3, move: 2}}
    ]},
    {min: 1300, max: 1800, roles: [
      { role: 'harvester', priority: 1, body: {work: 5, carry: 5} },
      { role: 'miner',     priority: 2, body: {work: 5, carry: 1} },
      { role: 'carrier',   priority: 3, body: {carry: 8} },
      { role: 'builder',   priority: 4, body: {work: 2, carry: 4} },
      { role: 'upgrader',  priority: 4, body: {work: 2, carry: 5} },
      { role: 'demo',      priority: 5, body: {work: 8, carry: 4} },
      { role: 'mass-upgrader', priority: 6, body: {work: 12, carry: 1, move: 1} },
      { role: 'repairer',  priority: 4, body: {work: 8, carry: 8, move: 2} },
      { role: 'rampart-d', priority: 0, body: {attack: 8, move: 4}},
      { role: 'wall-d',    priority: 0, body: {ranged: 6, move: 3}}
    ]},
    {min: 1800, max: 2300, roles: [
      { role: 'harvester',     priority: 1, body: {work: 5, carry: 5} },
      { role: 'miner',         priority: 2, body: {work: 5, carry: 1} },
      { role: 'carrier',       priority: 3, body: {carry: 20} },
      { role: 'builder',       priority: 4, body: {work: 10, carry: 6} },
      { role: 'upgrader',      priority: 4, body: {work: 2, carry: 5} },
      { role: 'demo',          priority: 5, body: {work: 8, carry: 4} },
      { role: 'mass-upgrader', priority: 6, body: {work: 12, carry: 1} },
      { role: 'repairer',      priority: 4, body: {work: 8, carry: 8} },
      { role: 'rampart-d', priority: 0, body: {attack: 10, move: 5}},
      { role: 'wall-d',    priority: 0, body: {ranged: 8, move: 4}}
    ]},
    {min: 2300, max: 9000, roles: [
      { role: 'harvester', priority: 1, body: {work: 5, carry: 5} },
      { role: 'miner',     priority: 2, body: {work: 5, carry: 1} },
      { role: 'carrier',   priority: 3, body: {carry: 10} },
      { role: 'builder',   priority: 4, body: {work: 10, carry: 6} },
      { role: 'upgrader',  priority: 4, body: {work: 2, carry: 5} },
      { role: 'demo',      priority: 5, body: {work: 8, carry: 5} },
      { role: 'big-miner', priority: 2, body: {work: 14, carry: 1} },
      { role: 'excavator', priority: 6, body: {work: 22, carry: 1, move: 1} },
      { role: 'hauler',    priority: 6, body: {carry: 10} },
      { role: 'mass-upgrader', priority: 6, body: {work: 12, carry: 1} },
      { role: 'peddler',   priority: 6, body: {carry: 20} },
      { role: 'repairer',  priority: 4, body: {work: 8, carry: 8} },
      { role: 'rampart-d', priority: 0, body: {attack: 12, move: 6}},
      { role: 'wall-d',    priority: 0, body: {ranged: 10, move: 5}}

    ]}
  ],

  getRoles: function(energy) {
    var roles
    ROLES.roles.forEach(function(role) {
      if(energy >= role.min && energy < role.max) roles = role.roles
    })
    if(!roles) roles = []
    return roles
  },

  getHarvesterMulti: function(room) {
    if (!room.carrierReady()) return (Finder.findSourcePositionCount(room.name))
    return 0
  },

  getBuilderMulti: function(room) {
    if(room.needsConstruction()) return 2
    return 0
  },

  getUpgraderMulti: function(room){
    if(room.needsConstruction()) return 1
    return 2
  },

  getDemoMulti: function(room){
    if(room.needsDemolition()) return 2
    return 0
  },

  getBigMinerMulti: function(room){
    // if(room.energyCapacity() >= 2300) return 1
    return 0
  },

  getExcavatorMulti: function(room){
    if(room.excavatorReady()) return 1
    return 0
  },
  getHaulerMulti: function(room){
    if(room.excavatorReady()) return 1
    return 0
  },

  getCarrierMulti: function(room) {
    if (room.carrierReady()) return room.sourceCount() * 1 + _.size(Finder.findDropedEnergy(room.name))
    return 0
  },

  getMinerMulti: function(room){
    if (room.carrierReady()) return room.sourceCount()
    return 0
  },
  getMassUpgraderMulti: function(room){
    if(room.storage && room.storage.storedEnergy() > 10000) return _.min([Math.floor(room.storage.storedEnergy() / 10000), 3])
    return 0
  },
  getPeddlerMulti: function(room){
    if(room.terminal && _.sum(room.terminal.store) > 0) return 1
    if(room.terminal) return _.size(room.memory.sell)
  },
  getRepairerMulti: function(room){
    if (room.carrierReady()) return 1
    return 0
  },
  getRampartDMulti: function(room){
    if(room.hasHostiles()) return _.size(Finder.findRamparts(room.name))
    return 0
  },
  getWallDMulti: function(room){
    if(room.memory.attackPrep === -1) return 0
    if(room.hasHostiles()) return 10
    if(room.memory.attackPrep) return 10
    return 0
  }



}

var EXOROLES = {
  roles: [
    {min: 300, max: 550, roles: [
      {role: 'exo-builder',   arrayName: 'build',   priority: 200, body: {work: 1, carry: 1}},
      {role: 'exo-upgrader',  arrayName: 'upgrade',   priority: 200, body: {work: 1, carry: 1}},
      {role: 'exo-harvester', arrayName: 'harvest', priority: 201, body: {work: 1, carry: 1}},
      {role: 'exo-theif',     arrayName: 'steal',   priority: 205, body: {work: 2, carry: 1}},
      {role: 'exo-responder', arrayName: 'responder', priority: 198, body: {attack: 2, tough: 4}},
      {role: 'exo-scout',     arrayName: 'scout',   priority: 199, body: {move: 1} }
    ]},
    {min: 550, max: 800, roles: [
      {role: 'exo-builder',   arrayName: 'build',   priority: 200, body: {work: 1, carry: 2}},
      {role: 'exo-upgrader',  arrayName: 'upgrade', priority: 200, body: {work: 1, carry: 2}},
      {role: 'exo-harvester', arrayName: 'harvest', priority: 201, body: {work: 1, carry: 2}},
      {role: 'exo-theif',     arrayName: 'steal',   priority: 205, body: {work: 4, carry: 1, move: 2}},
      {role: 'exo-responder', arrayName: 'responder', priority: 198, body: {attack: 2, tough: 4}},
      {role: 'exo-scout',     arrayName: 'scout',   priority: 199, body: {move: 1} }
    ]},
    {min: 800, max: 1300, roles: [
      {role: 'exo-builder',   arrayName: 'build',   priority: 200, body: {work: 1, carry: 2}},
      {role: 'exo-upgrader',  arrayName: 'upgrade',   priority: 200, body: {work: 1, carry: 2}},
      {role: 'exo-harvester', arrayName: 'harvest', priority: 201, body: {work: 1, carry: 2}},
      {role: 'exo-theif',     arrayName: 'steal',   priority: 205, body: {work: 4, carry: 1, move: 5}},
      {role: 'exo-responder', arrayName: 'responder', priority: 198, body: {attack: 2, tough: 4}},
      {role: 'exo-miner',     arrayName: 'mine',    priority: 201, body: {work: 3, carry: 1}},
      {role: 'exo-carrier',   arrayName: 'carry',   priority: 202, body: {work: 1, carry: 8, move: 5}},
      {role: 'exo-scout',     arrayName: 'scout',   priority: 199, body: {move: 1} },
      {role: 'exo-claimer',   arrayName: 'claim',   priority: 200, body: {claim: 1} }
    ]},
    {min: 1300, max: 1800, roles: [
      {role: 'exo-builder',   arrayName: 'build',   priority: 200, body: {work: 2, carry: 2} },
      {role: 'exo-upgrader',  arrayName: 'upgrade',   priority: 200, body: {work: 2, carry: 2} },
      {role: 'exo-harvester', arrayName: 'harvest', priority: 201, body: {work: 3, carry: 6} },
      {role: 'exo-theif',     arrayName: 'steal',   priority: 205, body: {work: 4, carry: 4} },
      {role: 'exo-responder', arrayName: 'responder', priority: 198, body: {heal: 1, attack: 2, ranged: 2, tough: 10, move: 9} },
      {role: 'exo-claimer',   arrayName: 'claim',   priority: 199, body: {claim: 1} },
      {role: 'exo-reserver',  arrayName: 'reserve', priority: 200, body: {claim: 2} },
      {role: 'exo-miner',     arrayName: 'mine',    priority: 201, body: {work: 7, carry: 1} },
      {role: 'exo-carrier',   arrayName: 'carry',   priority: 202, body: {work: 1, carry: 15, move: 8} },
      {role: 'exo-sapper',    arrayName: 'sapper',  prioirty: 206, body: {ranged: 5, work: 2, carry: 2} },
      {role: 'exo-scout',     arrayName: 'scout',   priority: 199, body: {move: 1} }
    ]},
    {min: 1800, max: 2300, roles: [
      {role: 'exo-builder',   arrayName: 'build',   priority: 200, body: {work: 8, carry: 8} },
      {role: 'exo-upgrader',  arrayName: 'upgrade',   priority: 200, body: {work: 8, carry: 8} },
      {role: 'exo-harvester', arrayName: 'harvest', priority: 202, body: {work: 3, carry: 6} },
      {role: 'exo-theif',     arrayName: 'steal',   priority: 205, body: {work: 4, carry: 4} },
      {role: 'exo-responder', arrayName: 'responder', priority: 198, body: {heal: 1, attack: 2, ranged: 2, tough: 10} },
      {role: 'exo-claimer',   arrayName: 'claim',   priority: 201, body: {claim: 2} },
      {role: 'exo-reserver',  arrayName: 'reserve', priority: 201, body: {claim: 2} },
      {role: 'exo-miner',     arrayName: 'mine',    priority: 202, body: {work: 7, carry: 1} },
      {role: 'exo-carrier',   arrayName: 'carry',   priority: 203, body: {work: 1, carry: 11, move: 6} },
      {role: 'exo-sapper',    arrayName: 'sapper',  prioirty: 205, body: {ranged: 2, work: 2, carry: 3, move: 10, heal: 2} },
      {role: 'exo-scout',     arrayName: 'scout',   priority: 200, body: {move: 1} }
    ]},
    {min: 2300, max: 9000, roles: [
      {role: 'exo-builder',   arrayName: 'build',   priority: 200, body: {work: 8, carry: 8} },
      {role: 'exo-upgrader',  arrayName: 'upgrade',   priority: 200, body: {work: 8, carry: 8} },
      {role: 'exo-harvester', arrayName: 'harvest', priority: 201, body: {work: 3, carry: 6} },
      {role: 'exo-theif',     arrayName: 'steal',   priority: 205, body: {work: 4, carry: 4} },
      {role: 'exo-responder', arrayName: 'responder', priority: 200, body: {heal: 1, attack: 2, ranged: 2, tough: 10} },
      {role: 'exo-claimer',   arrayName: 'claim',   priority: 200, body: {claim: 2} },
      {role: 'exo-reserver',  arrayName: 'reserve', priority: 200, body: {claim: 2} },
      {role: 'exo-miner',     arrayName: 'mine',    priority: 201, body: {work: 7, carry: 1} },
      {role: 'exo-carrier',   arrayName: 'carry',   priority: 202, body: {work: 1, carry: 11, move: 6} },
      {role: 'exo-sapper',    arrayName: 'sapper',  prioirty: 206, body: {ranged: 5, work: 2, carry: 2} },
      {role: 'exo-reaper',    arrayName: 'reap',    priority: 211, body:  {work: 12, carry: 10, move: 11} },
      {role: 'exo-gaurd',     arrayName: 'reap',    priority: 210, body:  {attack: 10, tough: 20, heal: 2, move: 16} },
      {role: 'exo-scout',     arrayName: 'scout',   priority: 199, body: {move: 1} }
    ]}
  ],
  getRoles: function(energy) {
    var roles
    EXOROLES.roles.forEach(function(role) {
      if(energy >= role.min && energy < role.max) roles = role.roles
    })
    if(!roles) roles = []
    return roles
  },
  getExoBuilderMulti: function(room){
    return 8
  },
  getExoUpgraderMulti: function(room){
    return 8
  },
  getExoHarvesterMulti: function(room){
    return 2
  },
  getExoClaimerMulti: function(room){
    return 1
  },
  getExoReserverMulti: function(room){
    return 2
  },
  getExoTheifMulti: function(room){
    return 2
  },
  getExoMinerMulti: function(room){
    return 1
  },
  getExoCarrierMulti: function(room){
    return 1
  },
  getExoCarryMulti: function(room){
    return 1
  },
  getExoResponderMulti: function(room){
    return 2
  },
  getExoSapperMulti: function(room){
    return 8
  },
  getExoScoutMulti: function(room){
    return 1
  },
  getExoReaperMulti: function(room){
    return 1
  },
  getExoGaurdMulti: function(room){
    return 2
  }
}

var ARMY = {
  'No Wall': [
    { role: 'exo-tank',      arrayName: 'attack',  multiplyer: 2,  priority: 100, body: BodyBuilder.buildBody({heal: 1, work: 1}, 1300, true, true, false) },
    { role: 'exo-attacker',  arrayName: 'attack',  multiplyer: 5,  priority: 110, body: BodyBuilder.buildBody({ attack: 2, ranged: 1, tough: 5}, 1300, true, false, false) },
    { role: 'exo-healer',    arrayName: 'attack',  multiplyer: 2,  proiorty: 120, body: BodyBuilder.buildBody({ heal: 2 }, 1300, true, false, false) }
  ],
  'litewalls': { roles: [
    { role: 'exo-demo',     arrayName: 'attack',   multiplyer: 4, priority: 100, body: BodyBuilder.buildBody({work: 5, ranged: 2, move: 9, tough: 2}, 1300, false, false, false)},
    { role: 'exo-attacker', arrayName: 'attack',   multiplyer: 5, priority: 100, body: BodyBuilder.buildBody({ranged: 2, attack: 2, move: 6, tough: 2}, 800, false, false, false)}

    ], rally: 9},
  "Drain Tower": {roles: [
    { role: 'exo-tank',      arrayName: 'attack',  multiplyer: 12,  priority: 103, body: BodyBuilder.buildBody({heal: 1, work: 1}, 1300, true, true, false) },
    { role: 'exo-attacker',  arrayName: 'attack',  multiplyer: 15,  priority: 110, body: BodyBuilder.buildBody({ attack: 2, ranged: 1, tough: 5}, 1300, true, false, false) },
    { role: 'exo-healer',    arrayName: 'attack',  multiplyer: 4,  proiorty: 120, body: BodyBuilder.buildBody({ heal: 2 }, 1300, true, false, false) }
  ], rally: 27},
  'swarm': {roles: [
    { role: 'exo-attacker',  arrayName: 'attack', multiplyer: 5, priority: 103, body: BodyBuilder.buildBody({attack: 2, move: 6, tough: 4}, 500, false, false, false)}
  ], rally: 5},
  'kite': {roles: [
    { role: 'exo-attacker',  arrayName: 'attack', multiplyer: 5, priority: 103, body: BodyBuilder.buildBody({ranged: 2, attack: 2, move: 6, tough: 2}, 800, false, false, false)}
  ], rally: 5},
  'heavy': { roles: [
    { role: 'exo-attacker',  arrayName: 'attack',  multiplyer: 8,  priority: 110, body: BodyBuilder.buildBody({ attack: 5, ranged: 5, heal: 1, tough: 15, move: 13}, 2300, false, true, true) },
    { role: 'exo-healer',    arrayName: 'attack',  multiplyer: 2,  proiorty: 120, body: BodyBuilder.buildBody({ heal: 5, attack: 2, ranged: 2, tough: 2, move: 11}, 2300, false, true, true) }
  ], rally: 10 },
  'noob-tower': {roles: [
    { role: 'exo-attacker',  arrayName: 'attack',  multiplyer: 100,  priority: 110, body: BodyBuilder.buildBody({ attack: 1, move: 1}, 550, false, true, true) }
  ], rally: 100  },
  'drain': {roles: [
    { role: 'exo-attacker',  arrayName: 'attack',  multiplyer: 6,  priority: 110, body: BodyBuilder.buildBody({ heal: 4, move: 5, tough: 5}, 1300, false, false, false) },
  ], rally: 6  },
  'stream': {roles: [
    { role: 'exo-attacker',  arrayName: 'attack',  multiplyer: 40,  priority: 110, body: BodyBuilder.buildBody({move: 1}, 1300, false, true, true) },
  ], rally: 1 },
  'block': {roles: [
    { role: 'exo-attacker',  arrayName: 'attack', multiplyer: 20, priority: 101, body: BodyBuilder.buildBody({move: 1}, 550, false, false, false) }
  ], rally: 10 },
  'post': {roles: [
    { role: 'exo-attacker',  arrayName: 'attack', multiplyer: 10, priority: 103, body: BodyBuilder.buildBody({ranged: 2, attack: 2, move: 6, tough: 2}, 800, false, false, false)},
    { role: 'exo-healer',    arrayName: 'attack', multiplyer: 2,  priority: 104, body: BodyBuilder.buildBody({heal: 4, move: 4}, 1300, false, false, false)}
  ], rally: 5},
  'test': {roles: [
    { role: 'exo-attacker',  arrayName: 'attack', multiplyer: 10, priority: 103, body: BodyBuilder.buildBody({attack: 1, move: 1}, 300, false, false, false)},
  ], rally: 5}
}


// module.exports = ROLES, EXOROLES;
