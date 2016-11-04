/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-11-01 04:48:02
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-01 20:51:32
*/

'use strict';

var DUMBROLES = {
  roles: [
    {min: 300, max: 550, roles: [
      { role: 'worker', priority: 1, body: {work: 1, carry: 1, move: 2} },
    ]},
    {min: 550, max: 800, roles: [
      { role: 'worker', priority: 1, body: {work: 2, carry: 2, move: 4} },
    ]},
    {min: 800, max: 1300, roles: [
      { role: 'worker', priority: 1, body: {work: 2, carry: 2, move: 4} },
    ]}
  ],

  getRoles: function(energy) {
    var roles
    DUMBROLES.roles.forEach(function(role) {
      if(energy >= role.min && energy < role.max) roles = role.roles
    })
    if(!roles) roles = []
    return roles
  },

  getRole: function(energy, role) {
    let roles = _.filter(DUMBROLES.getRoles(energy), r=> r.role === role)
    if(_.size(roles) > 0) return roles[0]
  }

}
