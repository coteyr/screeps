/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-09-28 19:53:10
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-28 19:56:36
*/

'use strict';

// rally -> next room -> rally -> next room -> destination
// go home

let RemoteCreep = function(){}

RemoteCreep.prototype.remoteState = function(rally = false) {

  if(this.room.name != this.memory.home) {
    this.setState('go-home')
  }
  if(this.stateIs('go-home')){
    this.gotoRoom(this.memory.home)
    if(this.room.name == this.memory.home) delete this.memory.state
  }
}
