/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-21 05:48:36
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-12-12 23:55:51
*/

'use strict';

global.clearPaths = function() {
  Object.keys(Game.rooms).forEach(function(key, index) {
    this[key].clearPaths();
  }, Game.rooms);
}
global.clearGoals = function() {
  var ops = ['harvest', 'reserve', 'attack', 'steal', 'claim', 'mine', 'carry', 'build', 'responder', 'sapper', 'reap', 'upgrade']
  Object.keys(Game.rooms).forEach(function(key, index) {
      ops.forEach(function(op){
        Game.rooms[key].memory[op] = []
      })
  }, Game.rooms);
  global.clearSpawnQueue()
}
global.listGoals = function() {

  var ops = ['scout', 'harvest', 'reserve', 'attack', 'steal', 'claim', 'mine', 'carry', 'build', 'responder', 'sapper', 'reap', 'upgrade']
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
  }, Game.rooms)
  out += "</tbody></table>"
  console.log(out)

}
global.listSales = function() {
  var out = "<table cellpadding='5' cellspacing='5'><thead><tr><th style='border: 1px solid; padding: 4px'>Room</th><th style='border: 1px solid; padding: 4px'>Sales</th>"
  Object.keys(Game.rooms).forEach(function(key, index) {
    var room = Game.rooms[key]
    if(room.controller && room.controller.my) {
      out += "<tr><th style='border: 1px solid; padding: 4px'>" + this[key].name + "</th>"
      out += "<td style='border: 1px solid; padding: 4px; text-align: left;'>"
      if(!room.memory.sell) room.memory.sell = {}
      Object.keys(room.memory.sell).forEach(function(resource, index) {
        out += room.memory.sell[resource].total + " " + resource + ", "
      }, room.memory.sell)
      out += "</td></tr>"
    }

  }, Game.rooms)
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

global.reAttack = function(roomName, sourceRoom=false, role=false) {
  for(var name in Memory.creeps) {
    var creep = Memory.creeps[name]
    if(sourceRoom && creep.home === sourceRoom) {
      if(role && creep.role === role) {
        creep.mode = 'idle'
        creep.exo_target = roomName
      } else if(creep.role == 'exo-attacker' || creep.role == 'exo-tank' || creep.role == "exo-healer") {
        creep.mode = 'idle'
        creep.exo_target = roomName
      }
    } else {
      if(role) {
        if(creep.role == role) {
          creep.mode = 'idle'
          creep.exo_target = roomName
        }
      } else if(creep.role == 'exo-attacker' || creep.role == 'exo-tank' || creep.role == "exo-healer") {
          creep.mode = 'idle'
          creep.exo_target = roomName
      }
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

global.reap = function(role) {
  Finder.findAllCreeps(role).forEach(function(c) {
    var o = Game.getObjectById(c.id)
    if(o.memory.er != true) o.suicide()
  })
  global.clearSpawnQueue()
}

global.forceTarget = function(id) {
  for(var name in Memory.creeps) {
    var creep = Memory.creeps[name]
    if(creep.role == 'exo-attacker') {
     creep.target = id
    }
  }
}
global.quite = function(ticks=100) {
  Memory.quite = Game.time + ticks
}
global.reTask = function(role, home, target) {
  for(var name in Memory.creeps) {
    var creep = Memory.creeps[name]
    creep.home = home
    creep.target = target
    creep.role = role
    creep.state = 'go-home'
  }
}
global.flagPath = function(creepName) {
  let creep = Game.creeps[creepName]
  let room = creep.room
  let path = creep.memory['_move']
  path = Room.deserializePath(path['path'])
  global.clearFlagPath()
  path.forEach(function(spot){

    room.createFlag(spot['x'], spot['y'] , null, COLOR_RED, COLOR_WHITE)
  })
}
global.clearFlagPath = function(){
  Object.keys(Game.flags).forEach(function(key) {
    let flag = Game.flags[key]
    if (flag.color == COLOR_RED && flag.secondaryColor == COLOR_WHITE) flag.remove()
  })
}
