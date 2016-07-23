/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-21 05:48:36
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-23 04:45:53
*/

'use strict';

global.clearPaths = function() {
  Object.keys(Game.rooms).forEach(function(key, index) {
    this[key].clearPaths();
  }, Game.rooms);
}

global.listGoals = function() {

  var ops = ['harvest', 'reserve', 'attack', 'steal', 'claim', 'mine', 'carry']

  Object.keys(Game.rooms).forEach(function(key, index) {
      if(Game.rooms[key].controller && Game.rooms[key].controller.my) {
      console.log("Listing Room " + this[key].name)
      console.log('===============================')
      ops.forEach(function(x) {
        Game.rooms[key].list(x);
      })
    }
  }, Game.rooms);

}

global.showUsed = function() {
  Memory.show_used_cpu = true
  Memory.used_cpu = 0.0
}

global.hideUsed = function() {
  delete Memory.show_used_cpu
}


global.logUsedCPU = function(object) {
  if(Memory.show_used_cpu){
    Log.info(object.name + " used: " + (Game.cpu.getUsed() - Memory.used_cpu))
    Memory.used_cpu = Game.cpu.getUsed()
  }
}

global.resetUsedCPU = function() {
  Memory.used_cpu = Game.cpu.getUsed();
}
