/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-14 09:43:31
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-08 08:36:07
*/

'use strict';

let STATS = {}
module.exports.loop = function () {
  let kernel = new Kernel()
  _.each(Game.spawns, s => { s.tick(kernel) })
  _.each(Game.creeps, c => { c.tick(kernel) })
  _.each(Game.rooms,  r => { r.tick(kernel) })
  kernel.tick()
  // STATS = {}
  // profiler.wrap(function() {
    /*PathFinder.use(true)
    _.forEach(Game.rooms, function(room, name) {
      if(Game.cpu.bucket < 400) {
        Log.warn(['Building Bucket', Game.cpu.bucket])
        return false
      } else {
        global[name] = room
        if(room.isMine()) {
          if(room.rcl() == 1) {
            _.merge(Room.prototype, RCL1Room.prototype)
            room.subTick()
          } else if(room.rcl() == 2) {
            _.merge(Room.prototype, RCL2Room.prototype)
            room.subTick()
          } else if(room.rcl() == 3) {
            _.merge(Room.prototype, RCL3Room.prototype)
            room.subTick()
          } else if(room.rcl() == 4) {
            _.merge(Room.prototype, RCL4Room.prototype)
            room.subTick()
          }
        } else {
          room.tick()
        }

      }
      if(Config.showOverlay) {
        global.showWalls(room.name)
        global.showRamps(room.name)
        global.showExtensions(room.name)
      }
    })

    hud.addLine('CPU', Game.cpu.getUsed(), Game.cpu.limit, null)
    hud.addLine('Bucket', Game.cpu.bucket, 10000, true)
    hud.addLine('Creeps Processed', Storage.readStat('creep-proc', 0), _.size(Game.creeps), true)
    hud.addLine('Room Processed', Storage.readStat('room-proc', 0), _.size(Game.rooms), true)
    hud.addLine('Move CPU', Storage.readStat('account-cpu-move', 0), Game.cpu.getUsed(), Config.colors.blue)
    hud.addLine('Attack CPU', Storage.readStat('account-cpu-attack', 0), Game.cpu.getUsed(), Config.colors.red)
    hud.addLine('Work CPU', Storage.readStat('account-cpu-work', 0), Game.cpu.getUsed(), Config.colors.yellow)
    */
    /*if(Config.showHud) {
      let hud = new Hud
      hud.display()
    }
    Log.tick()*/
  //})

}
