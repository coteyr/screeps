/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-08-14 18:38:05
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-06 02:23:18
*/

'use strict';

var Alarm = {
  tick: function(){
    Log.debug("Ticking Alarm!")
    this.getAlarm()
  },
  addAlarm: function(ticks, message, command) {
    var alertAt = Game.time + ticks
    if(!Memory.alarms) Memory.alarms = []
    var array = Memory.alarms
    var newAlarm = {time: alertAt, message: message, command: command}
    array.push(newAlarm)
    Memory.alarms = array
    Log.warn('Added a new alarm at: ' + alertAt)
  },
  getAlarm: function() {
    var alerts = _.filter(Memory.alarms, function(a) { return a.time <= Game.time})
    alerts.forEach(function(alert){
      Game.notify(alert.message, 0)
      Notify("Alarm Triggered", alert.message, 0)
      console.log("<h1>" + alert.message + "</h1>")
      if(alert.command) Alarm.runAlarm(alert.command)
    })
    var all = Memory.alarms

    _.remove(all, function(a) {
      return a.time <= Game.time
    })
    Memory.alarms = all
  },
  runAlarm: function(command){
    try {
      eval(command)
    } catch(error) {
      Log.error("ALARM HAS AN ERROR")
      Log.error(error.message)
      Log.error(command)
    }
  }
}
