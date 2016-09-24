1/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:40:25
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-20 19:15:47
*/

'use strict';

var Log = {
  debug: function(message, room, creep) {
    if (logLevel >= 5) this.buildMessage('ltgray', message, room, creep)
  },
  info: function(message, room, creep) {
    if (logLevel >= 4) this.buildMessage('blue', message, room, creep)
  },

  warn: function(message, room, creep) {
    if (logLevel >= 3) this.buildMessage('yellow', message, room, creep)
  },
  error: function(message, room, creep) {
    if (logLevel >= 2) this.buildMessage('red', message, room, creep)
  },

  critical: function(message, room, creep) {
    if (logLevel >= 1) this.buildMessage('red', message, room, creep)
  },
  alert: function(message, room, creep) {
    this.buildMessage('purple', "<h1>" + message + "</h1>", room, creep)
  },

  tick: function() {
    if (logLevel >= 0) {
      // console.log('<button style="background-color: #00DD00; color: #FFFFFF" onclick="listGoals()"> List Goals </button>')
      if(Game.time % 10 === 0) {
        var body = ""
        body += "<h2 style='width: 1000px;'>Summary for tick: <font color='#00DD00'>" + Game.time + "</font></h2>"
        body += "<hr/>"
        body += "<table style='width: 100%;'><tbody>"
        body += "<tr><th>CPU</th><td>" + Game.cpu.getUsed().toFixed(2) + ' of ' + Game.cpu.limit.toFixed(2) + "</td><td>" + this.progressBar(Game.cpu.getUsed(), Game.cpu.limit) + "</td></tr>"
        body += "<tr><th>Bucket</th><td>" + Game.cpu.bucket + ' of 10000' + "</td><td>" + this.progressBar(Game.cpu.bucket, 10000) + "</td></tr>"
        body += "<tr><th>GCL Progress</th><td>" + Game.gcl.progress.toFixed(2) + ' of ' + Game.gcl.progressTotal.toFixed(2) + "</td><td>" + this.progressBar(Game.gcl.progress,  Game.gcl.progressTotal) + "</td></tr>"
        body += "<tr><th>Spawn Queue</th><td>" + _.size(Memory.spawn_queue) + "</td><td></td></tr>"
        body += "<tr><th>Creep Count</th><td>" + _.size(Memory.creeps) + "</td><td></td></tr>"
        Object.keys(Game.rooms).forEach(function(key, index) {
          var room = Game.rooms[key]
          if(room.controller && room.controller.my) {
            body += "<tr><td colspan='3' style='text-align: center'>Summary for " + room.name + "</td></tr>"
            body += "<tr><th>Energy</th><td>" + room.energyAvailable + " of " + room.energyCapacityAvailable + "</td><td>" + Log.progressBar(room.energyAvailable, room.energyCapacityAvailable) + "</td></tr>"
            body += "<tr><th>RCL Progress</th><td>" + room.controller.progress.toFixed(2) + " of " + room.controller.progressTotal.toFixed(2) + "</td><td>" + Log.progressBar(room.controller.progress, room.controller.progressTotal) + "</td></tr>"
          }
        }, Game.rooms);
        body += "</tbody></table>"
        if(Memory.quite < Game.time) console.log(body)
      } else {
        if(Memory.quite < Game.time) console.log(this.colorizer('green', 'TICK: ') + this.colorizer('yellow', Game.time + ' ') + this.colorizer('green', 'CPU: ') + this.colorizer('yellow', Game.cpu.getUsed().toFixed(2) + ' of ' + Game.cpu.limit.toFixed(2) + ' ') + this.colorizer('green',  'Bucket: ') + this.colorizer('yellow', Game.cpu.bucket))
        if(Memory.quite < Game.time) console.log(this.colorizer('green', 'Energy Harvested: ') + this.colorizer('yellow', Memory.harvest_this_tick + ' ') + this.colorizer('green', 'Average Energy Per Tick: ') + this.colorizer('yellow', Memory.harvest_average.toFixed(2)))
      }
    }
  },
  progressBar: function(value, max) {
    var body = "<div style='border: 1px solid #FFFFFF; background-color: #3a3a3a; width: 100%;'>"
    var percentage = (value / max) * 100
    var color = '#b99cfb'
    if(percentage >= 10) color = '#65fd62'
    if(percentage >= 25) color = '#5d80b2'
    if(percentage >= 50) color = '#ffe56d'
    if(percentage >= 75) color = '#f93842'
    body += "<div style='text-align: center; border: 0px none; background-color: " + color + "; width: " + percentage + "%'>"
    body += "<span style='color: #cccccc; font-weight: bold'>" + percentage.toFixed(2) + "%</span>"
    body += "</div></div>"
    return body
  },

  buildMessage(color, message, room, creep){
    var msg = ""
    if (room && room.name) msg += this.colorizer('green', room.name + " ")
    if (creep && creep.name) msg += this.colorizer('yellow', creep.name + " ")
    msg += this.colorizer(color, message)
    if(Memory.quite < Game.time) console.log(msg)
  },
  colorizer(tcolor, message) {
    // ltgray  #a9b7c6
    // yellow #ffe56d
    // gray   #777777
    // red    #f93842
    // blue   #5d80b2
    // green  #65fd62
    // purple #b99cfb
    // white  #ffffff
    var color = '#A9B7C6'
    if(tcolor === 'yellow') color = "#FFE56D"
    if(tcolor === 'gray')   color = "#777777"
    if(tcolor === 'red')    color = "#F93842"
    if(tcolor === 'blue')   color = "#5D80B2"
    if(tcolor === 'green')  color = '#65FD62'
    if(tcolor === 'purple') color = '#B99CFB'
    if(tcolor === 'while')  color = '#FFFFFF'
    return "<span style='color: " + color + ";'>" + message + "</span>"
  }
}
module.exports = Log;
