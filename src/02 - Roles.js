/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-15 16:33:03
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-12 22:14:18
*/

'use strict';
var ROLES = {
  roles: [
    {min: 300, max: 550, roles: [
      { role: 'harvester', priority: 1, body: {work: 1, carry: 2} },
      { role: 'builder',   priority: 4, body: {work: 1, carry: 1} },
      { role: 'upgrader',  priority: 4, body: {work: 1, carry: 1} }
    ]},
    {min: 550, max: 800, roles: [
      { role: 'harvester', priority: 1, body: {work: 2, carry: 4} },
      { role: 'miner',     priority: 2, body: {work: 3, carry: 4} },
      { role: 'carrier',   priority: 3, body: {carry: 5} },
      { role: 'builder',   priority: 4, body: {work: 2, carry: 3} },
      { role: 'upgrader',  priority: 4, body: {work: 3, carry: 3} },
      { role: 'demo',      priority: 5, body: {work: 3, carry: 1} }

    ]},
    {min: 800, max: 1300, roles: [
      { role: 'harvester', priority: 1, body: {work: 4, carry: 3} },
      { role: 'miner',     priority: 2, body: {work: 3, carry: 4} },
      { role: 'carrier',   priority: 3, body: {carry: 6} },
      { role: 'builder',   priority: 4, body: {work: 3, carry: 3} },
      { role: 'upgrader',  priority: 4, body: {work: 3, carry: 3} },
      { role: 'demo',      priority: 5, body: {work: 4, carry: 2} }
    ]},
    {min: 1300, max: 1800, roles: [
      { role: 'harvester', priority: 1, body: {work: 5, carry: 5} },
      { role: 'miner',     priority: 2, body: {work: 5, carry: 4} },
      { role: 'carrier',   priority: 3, body: {carry: 8} },
      { role: 'builder',   priority: 4, body: {work: 2, carry: 4} },
      { role: 'upgrader',  priority: 4, body: {work: 5, carry: 5} },
      { role: 'demo',      priority: 5, body: {work: 8, carry: 4} }
    ]},
    {min: 1800, max: 2300, roles: [
      { role: 'harvester', priority: 1, body: {work: 5, carry: 5} },
      { role: 'miner',     priority: 2, body: {work: 5, carry: 4} },
      { role: 'carrier',   priority: 3, body: {carry: 8} },
      { role: 'builder',   priority: 4, body: {work: 2, carry: 4} },
      { role: 'upgrader',  priority: 4, body: {work: 5, carry: 5} },
      { role: 'demo',      priority: 5, body: {work: 8, carry: 4} }
    ]},
    {min: 2300, max: 9000, roles: [
      { role: 'harvester', priority: 1, body: {work: 5, carry: 5} },
      { role: 'carrier',   priority: 3, body: {carry: 8} },
      { role: 'builder',   priority: 4, body: {work: 2, carry: 4} },
      { role: 'upgrader',  priority: 4, body: {work: 5, carry: 5} },
      { role: 'demo',      priority: 5, body: {work: 8, carry: 4} },
      { role: 'big-miner', priority: 2, body: {work: 14, carry: 8} },
      { role: 'excavator', priority: 6, body: {work: 6, carry: 6} },
      { role: 'hauler',    priority: 6, body: {carry: 6} }

    ]}
  ],

  getRoles: function(energy) {
    var roles
    ROLES.roles.forEach(function(role) {
      if(energy >= role.min && energy < role.max) roles = role.roles
    })
    return roles
  },

  getHarvesterMulti: function(room) {
    if (!room.carrierReady()) return room.sourceCount() * 4
    return 0
  },

  getBuilderMulti: function(room) {
    if(room.needsConstruction()) return 2
    return 1
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
    if(room.energyCapacity() >= 2300) return 1
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
    if (room.carrierReady()) return room.sourceCount() * 1.50
    return 0
  },

  getMinerMulti: function(room){
    if (room.carrierReady() && room.energyCapacity() < 2300) return room.sourceCount()
    return 0
  }


}

var EXOROLES = {
  roles: [
    {min: 300, max: 550, roles: [
      {role: 'exo-builder', arrayName: 'build', priority: 200, body: {work: 1, carry: 2}},
      {role: 'exo-harvester', arrayName: 'harvest', priority: 200, body: {work: 1, carry: 2}},
      {role: 'exo-theif', arrayName: 'steal', priority: 200, body: {work: 2, carry: 1}},
      {role: 'exo-responder', arrayName: 'respond', priority: 200, body: {attack: 2, tough: 4}}
    ]},
    {min: 550, max: 800, roles: [
      {role: 'exo-builder', arrayName: 'build', priority: 200, body: {work: 1, carry: 2}},
      {role: 'exo-harvester', arrayName: 'harvest', priority: 200, body: {work: 1, carry: 2}},
      {role: 'exo-theif', arrayName: 'steal', priority: 200, body: {work: 2, carry: 1}},
      {role: 'exo-responder', arrayName: 'respond', priority: 200, body: {attack: 2, tough: 4}}
    ]},
    {min: 800, max: 1300, roles: [
      {role: 'exo-builder', arrayName: 'build', priority: 200, body: {work: 1, carry: 2}},
      {role: 'exo-harvester', arrayName: 'harvest', priority: 200, body: {work: 1, carry: 2}},
      {role: 'exo-theif', arrayName: 'steal', priority: 200, body: {work: 2, carry: 1}},
      {role: 'exo-responder', arrayName: 'respond', priority: 200, body: {attack: 2, tough: 4}}
    ]},
    {min: 1300, max: 1800, roles: [
      {role: 'exo-builder',   arrayName: 'build',   priority: 200, body: {work: 2, carry: 2} },
      {role: 'exo-harvester', arrayName: 'harvest', priority: 200, body: {work: 3, carry: 6} },
      {role: 'exo-theif',     arrayName: 'steal',   priority: 200, body: {work: 4, carry: 4} },
      {role: 'exo-responder', arrayName: 'respond', priority: 200, body: {heal: 1, attack: 2, ranged: 2, tough: 10} },
      {role: 'exo-claimer',   arrayName: 'claim',   priority: 200, body: {claim: 2} },
      {role: 'exo-reserver',  arrayName: 'reserve',  priority: 200, body: {claim: 2} },
      {role: 'exo-miner',     arrayName: 'mine',    priority: 200, body: {work: 4, carry: 1} },
      {role: 'exo-carrier',   arrayName: 'carry',   priority: 200, body: {carry: 10} },
      {role: 'exo-sapper',    arrayName: 'sapper',  prioirty: 200, body: {ranged: 5, work: 2, carry: 2} }
    ]},
    {min: 1800, max: 2300, roles: [
      {role: 'exo-builder',   arrayName: 'build',   priority: 200, body: {work: 2, carry: 2} },
      {role: 'exo-harvester', arrayName: 'harvest', priority: 200, body: {work: 3, carry: 6} },
      {role: 'exo-theif',     arrayName: 'steal',   priority: 200, body: {work: 4, carry: 4} },
      {role: 'exo-responder', arrayName: 'respond', priority: 200, body: {heal: 1, attack: 2, ranged: 2, tough: 10} },
      {role: 'exo-claimer',   arrayName: 'claim',   priority: 200, body: {claim: 2} },
      {role: 'exo-reserver',  arrayName: 'reserve',  priority: 200, body: {claim: 2} },
      {role: 'exo-miner',     arrayName: 'mine',    priority: 200, body: {work: 4, carry: 1} },
      {role: 'exo-carrier',   arrayName: 'carry',   priority: 200, body: {carry: 10} },
      {role: 'exo-sapper',    arrayName: 'sapper',  prioirty: 200, body: {ranged: 5, work: 2, carry: 2} }
    ]},
    {min: 2300, max: 9000, roles: [
      {role: 'exo-builder',   arrayName: 'build',   priority: 200, body: {work: 2, carry: 2} },
      {role: 'exo-harvester', arrayName: 'harvest', priority: 200, body: {work: 3, carry: 6} },
      {role: 'exo-theif',     arrayName: 'steal',   priority: 200, body: {work: 4, carry: 4} },
      {role: 'exo-responder', arrayName: 'respond', priority: 200, body: {heal: 1, attack: 2, ranged: 2, tough: 10} },
      {role: 'exo-claimer',   arrayName: 'claim',   priority: 200, body: {claim: 2} },
      {role: 'exo-reserver',  arrayName: 'reserve',  priority: 200, body: {claim: 2} },
      {role: 'exo-miner',     arrayName: 'mine',    priority: 200, body: {work: 4, carry: 1} },
      {role: 'exo-carrier',   arrayName: 'carry',   priority: 200, body: {carry: 10} },
      {role: 'exo-sapper',    arrayName: 'sapper',  prioirty: 200, body: {ranged: 5, work: 2, carry: 2} }
    ]}
  ],
  getRoles: function(energy) {
    var roles
    EXOROLES.roles.forEach(function(role) {
      if(energy >= role.min && energy < role.max) roles = role.roles
    })
    return roles
  },
  getExoBuilderMulti: function(room){
    return 4
  },
  getExoHarvesterMulti: function(room){
    return 2
  },
  getExoClaimerMulti: function(room){
    return 1
  },
  getExoReserverMulti: function(room){
    return 1
  },
  getExoTheifMulti: function(room){
    return 2
  },
  getExoMinerMulti: function(room){
    return 1
  },
  getExoCarrierMulit: function(room){
    return 1
  },
  getExoResponderMulti: function(room){
    return 2
  },
  getExoSapperMulti: function(room){
    return 8
  }
}

var ARMY = {
  'No Wall': [
    { role: 'exo-tank',      arrayName: 'attack',  multiplyer: 2,  priority: 100, body: BodyBuilder.buildBody({heal: 1, work: 1}, 1300, true, true, false) },
    { role: 'exo-attacker',  arrayName: 'attack',  multiplyer: 5,  priority: 110, body: BodyBuilder.buildBody({ attack: 2, ranged: 1, tough: 5}, 1300, true, false, false) },
    { role: 'exo-healer',    arrayName: 'attack',  multiplyer: 2,  proiorty: 120, body: BodyBuilder.buildBody({ heal: 2 }, 1300, true, false, false) }
  ],
  'Lite Walls': [],
  'Drain Tower': [
    { role: 'exo-tank',      arrayName: 'attack',  multiplyer: 2,  priority: 100, body: BodyBuilder.buildBody({heal: 1, work: 1}, 1300, true, true, false) },
    { role: 'exo-attacker',  arrayName: 'attack',  multiplyer: 5,  priority: 110, body: BodyBuilder.buildBody({ attack: 2, ranged: 1, tough: 5}, 1300, true, false, false) },
    { role: 'exo-healer',    arrayName: 'attack',  multiplyer: 4,  proiorty: 120, body: BodyBuilder.buildBody({ heal: 2 }, 1300, true, false, false) }
  ],
  'Heavy Drain Tower': [],
  'Thick Walls': [],
  'Swarm': [],
  'Kite': [],
  'heavy': [
    { role: 'exo-tank',      arrayName: 'attack',  multiplyer: 4,  priority: 100, body: BodyBuilder.buildBody({heal: 1, work: 1, move: 10}, 1300, false, true, true) },
    { role: 'exo-attacker',  arrayName: 'attack',  multiplyer: 5,  priority: 110, body: BodyBuilder.buildBody({ attack: 8, move: 10}, 1300, false, true, true) },
    { role: 'exo-healer',    arrayName: 'attack',  multiplyer: 2,  proiorty: 120, body: BodyBuilder.buildBody({ heal: 2, move: 10}, false, true, true) }
  ] }


module.exports = ROLES, EXOROLES;
