/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-09-28 19:53:10
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-04 00:07:14
*/

'use strict';

// rally -> next room -> rally -> next room -> destination
// go home

let RemoteCreep = function(){}

RemoteCreep.prototype.remoteState = function(rally = false) {
  let home = Game.rooms[this.memory.home]
  if(rally) {
    if(this.stateIs('rally')) MilitaryActions.rally(this, ARMY[home.tactic()].rally, 'r-move-out', 'r-move-out')
    if(this.stateIs('r-move-out')) MilitaryActions.moveOut(this, this.memory.exo_target, 'choose', 'rally')
    if(this.stateIs('go-home')) MilitaryActions.moveOut(this, this.memory.home, 'are-home', 'go-home')
  } else {
    if(this.stateIs('r-move-out')) MilitaryActions.moveOut(this, this.memory.exo_target, 'choose', 'r-move-out')
    if(this.stateIs('go-home')) MilitaryActions.moveOut(this, this.memory.home, 'are-home', 'go-home')
  }
}

