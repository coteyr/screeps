/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 09:43:31
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-04-17 21:03:53
*/

'use strict';

const profiler = require('screeps-profiler');
profiler.enable();
let STATS = {}
module.exports.loop = function () {
  STATS = {}
  profiler.wrap(function() {
    PathFinder.use(true)
    _.forEach(Game.rooms, function(room, name) {
      if(Game.cpu.bucket < 400) {
        Log.warn(['Building Bucket', Game.cpu.bucket])
        return false
      } else {
        global[name] = room
        room.tick()
      }
      if(Config.showOverlay) {
        global.showWalls(room.name)
        global.showRamps(room.name)
        global.showExtensions(room.name)
      }
    })
    let hud = new Hud
    hud.addLine('CPU', Game.cpu.getUsed(), Game.cpu.limit, null)
    hud.addLine('Bucket', Game.cpu.bucket, 10000, true)
    hud.addLine('Creeps Processed', Storage.readStat('creep-proc', 0), _.size(Game.creeps), true)
    hud.addLine('Room Processed', Storage.readStat('room-proc', 0), _.size(Game.rooms), true)
    hud.addLine('Move CPU', Storage.readStat('account-cpu-move', 0), Game.cpu.getUsed(), Config.colors.blue)
    hud.addLine('Attack CPU', Storage.readStat('account-cpu-attack', 0), Game.cpu.getUsed(), Config.colors.red)
    hud.addLine('Work CPU', Storage.readStat('account-cpu-work', 0), Game.cpu.getUsed(), Config.colors.yellow)
    if(Config.showHud) hud.display()

    Log.tick()
  })

}
