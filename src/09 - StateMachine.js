/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-08-30 16:45:17
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-30 17:46:39
*/

'use strict';

let StateMachine = function() {}

StateMachine.prototype.state = function() {
  if(this.memory.state) return this.memory.state.toLowerCase()
}

StateMachine.prototype.setState = function(state) {

  /*if(typeof this.say != "undefined" && typeof this.saying != "undefined" && this.saying != state) {
    this.say(state)
  }*/
  // call backs here if we need
  this.memory.state = state.toLowerCase()
  return state.toLowerCase()
}

StateMachine.prototype.stateIs = function(testState) {
  return this.state() === testState.toLowerCase()
}
