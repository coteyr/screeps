/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-10-08 01:22:46
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-09 12:28:20
*/

'use strict';

let Reporting = {
  setValue: function(roomName, key, value){
    Memory.stats["room." + roomName + "." + key ] = value
  },
  setEmpireValue: function(key, value){
    Memory.stats["empire." + key ] = value
  },
  tickStart: function() {
    if(!Memory.stats) Memory.stats = {}
    Reporting.setupDefaults()
    Object.keys(Memory.stats.rooms).forEach(function(roomName){
      Reporting.setupDefaults(roomName)
      Object.keys(Memory.stats.rooms[roomName]).forEach(function(action) {
        Memory.stats.rooms[roomName][action]['thisTick'] = 0
        if(Game.time % 9000 == 0) {
          Memory.stats.counter = 0
          Memory.stats.rooms[roomName][action]['total'] = 0
        }
      })
    })
  },
  tickEnd: function() {
    Memory.stats.counter += 1
    Object.keys(Memory.stats.rooms).forEach(function(roomName){
      Object.keys(Memory.stats.rooms[roomName]).forEach(function(action) {
        Memory.stats.rooms[roomName][action]['average'] = Memory.stats.rooms[roomName][action]['total'] / Memory.stats.counter
      })
    })
    Reporting.log()
  },
  setupDefaults: function(room) {
    if(!Memory.stats) Memory.stats = {}
    if(!Memory.stats.rooms) Memory.stats.rooms = {}
    if(!Memory.stats.counter) Memory.stats.counter = 0
  },
  accountAction(action, roomName, amount) {
    if(!Memory.stats.rooms) Memory.stats.rooms = {}
    if(!Memory.stats.rooms[roomName]) Memory.stats.rooms[roomName] = {}
    if(!Memory.stats.rooms[roomName][action]) {
      Memory.stats.rooms[roomName][action] = {}
      Memory.stats.rooms[roomName][action]['total'] = 0
      Memory.stats.rooms[roomName][action]['average'] = 0
      Memory.stats.rooms[roomName][action]['thisTick'] = 0
    }
    Memory.stats.rooms[roomName][action]['total'] += amount
    Memory.stats.rooms[roomName][action]['thisTick'] += amount
  },
  getTickAction(action, roomName = false){
    if(roomName) return Memory.stats.rooms[roomName][action]['thisTick']
    return 0
  },
  getAverageAction(action, roomName = false) {
    if(roomName) return Memory.stats.rooms[roomName][action]['average']
  },
  log: function() {
    Object.keys(Memory.stats.rooms).forEach(function(roomName){
      let room = Game.rooms[roomName]
      if(room) {
        let result = ""
        Object.keys(Memory.stats.rooms[roomName]).forEach(function(action) {
          result += '[' + Log.colorizer('green', action) + " " + Log.colorizer('yellow', Memory.stats.rooms[roomName][action]['thisTick'] + "/t ") + Log.colorizer('purple', Memory.stats.rooms[roomName][action]['average'].toFixed(2) + "/at") +"] "
        })
        Log.info(result, room)
      }
    })

  }
}
