/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-21 05:48:36
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-26 06:03:30
*/

'use strict';

global.clearPaths = function() {
  Object.keys(Game.rooms).forEach(function(key, index) {
    this[key].clearPaths();
  }, Game.rooms);
}
global.clearGoals = function() {
  var ops = ['harvest', 'reserve', 'attack', 'steal', 'claim', 'mine', 'carry', 'build', 'responder', 'sapper']
  Object.keys(Game.rooms).forEach(function(key, index) {
      ops.forEach(function(op){
        Game.rooms[key].memory[op] = []
      })
  }, Game.rooms);
  global.clearSpawnQueue()
}
global.listGoals = function() {

  var ops = ['scout', 'harvest', 'reserve', 'attack', 'steal', 'claim', 'mine', 'carry', 'build', 'responder', 'sapper']
  var out = "<table cellpadding='5' cellspacing='5'><thead><tr><th style='border: 1px solid; padding: 4px'>Room</th>"
  ops.forEach(function(o){
    out += "<th style='border: 1px solid; padding: 4px'>" + o + "</th>"
  })
  out += "</tr></thead>"

  Object.keys(Game.rooms).forEach(function(key, index) {
      if(Game.rooms[key].controller && Game.rooms[key].controller.my) {
        out += "<tr><th style='border: 1px solid; padding: 4px'>" + this[key].name + "</th>"
        ops.forEach(function(o){
            var array = Game.rooms[key].memory[o] || []
            out += "<td style='border: 1px solid; padding: 4px; text-align: center;'>"
            array.forEach(function(value){
              out += value + " "
            })
          out += "</td>"
        })
        out += "</tr>"
      }
  }, Game.rooms);
  out += "</tbody></table>"
  console.log(out)

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

global.setGlobalSpawn = function(value) {
  Memory.global_spawn = value
}

global.globalSpawn = function() {
  return Memory.global_spawn
}

global.clearSpawnQueue = function() {
  delete Memory.spawn_queue
  Memory.spawn_queue = []
}

global.reAttack = function(roomName) {
  for(var name in Memory.creeps) {
    var creep = Memory.creeps[name]
    if(creep.role == 'exo-attacker') {
      creep.mode = 'idle'
      creep.exo_target = roomName
    }
  }
}

global.clearTargets = function() {
  for(var name in Memory.creeps) {
    delete Memory.creeps[name].target
  }
}

global.addAlarm = function(ticks, message, command){
  Alarm.addAlarm(ticks, message, command)
}


