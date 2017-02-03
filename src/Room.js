/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-29 19:24:01
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-03 18:34:04
*/

'use strict';

Room.prototype.tick = function() {
  Log.debug(['Ticking Room:', this.name])
  if(this.controller && this.controller.safeMode) {
    Log.print(["Safe Mode Until", this.controller.safeModeTill()], this.name)
  }
  if(this.controller) this.controller.tick()
  if(Finder.findIdleCreeps(this.name).length === 0) {
    this.spawnCreep()
  }
  if(this.needMiners()){
    let creep = _.first(Finder.findIdleCreeps(this.name))
    if(creep) creep.setTask("mine")
  }
  _.each(Finder.findCreeps(this.name), c => {c.tick()})



}

Room.prototype.spawnCreep = function() {
  let spawn = Finder.findIdleSpawn(this.name)
  if(spawn) {
    spawn.spawn()
  }
}

Room.prototype.needMiners = function() {
  let sources = Finder.findSources(this.name).length
  let miningCreeps = Finder.findCreepsWithTask(this.name, 'mine')
  let works = 0
  _.each(miningCreeps, c => { works = works + c.partCount(WORK)})
  Log.info(sources)
  Log.info(works)
  if(works < sources * 5 && miningCreeps.count < 4) return true
  return false
}
