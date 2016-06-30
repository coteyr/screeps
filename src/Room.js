/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:39:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-30 07:34:07
*/

'use strict';


Room.prototype.tick = function() {
  Log.debug('Ticking Room: ' + this.name + ": " + this.memory.refresh_count);
  this.refreshData();
  this.tickExtensions();
  this.tickSpawns();
  this.tickCreeps();
  return true;
};

Room.prototype.tickExtensions = function() {
  if (this.memory.my_extensions) {
    Object.keys(this.memory.my_extensions).forEach(function(key, index) {
      var extension = Game.getObjectById(this[key].id);
      extension.tick();
    }, this.memory.my_extensions);
  }
}

Room.prototype.tickSpawns = function() {
  if (this.memory.my_spawns) {
    Object.keys(this.memory.my_spawns).forEach(function(key, index) {
      var spawn = Game.getObjectById(this[key].id);
      spawn.tick();
    }, this.memory.my_spawns);
  }
}

Room.prototype.tickCreeps = function() {
  _.filter(Game.creeps).forEach(function(creep) {
    if(creep.my) {
      creep.tick();
    }
  });
}

Room.prototype.refreshData = function() {
  if(this.memory.refresh_count <= 0 || !this.memory.refresh_count) {
    this.memory.refresh_count = 500;
    var spawns = this.find(FIND_MY_SPAWNS);
    this.memory.my_spawns = spawns;
    var extensions = this.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
    this.memory.my_extensions = extensions
    this.findSourceSpots();
  }
  this.memory.refresh_count -= 1;
}

Room.prototype.reset = function() {
  this.memory.refresh_count = -1;
}

Room.prototype.findSourceSpots = function() {
  var room = this;
  if(!room.memory.sources) {
    delete room.memory.sources
    var sources = room.find(FIND_SOURCES);
    var count = 0;
    var out = {}
    sources.forEach(function(source) {
        room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true).forEach(function(spot) {
          if (spot.terrain == 'plain' || spot.terrain == 'swamp') {
            count += 1;
            spot['source'] = source;
            out[count] = spot;
          }
        })
      });
      room.memory.sources = out;
  }
}
