/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:04:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 20:48:26
*/

'use strict';

Creep.prototype.tick = function(){
  Log.info('Ticking Creep: ' + this.name);
  if (this.memory.role == 'harvester') {
    this.assignHarvesterTasks()
  }
  this.doWork();
}

Creep.prototype.doWork = function() {
  if(this.memory.mode == 'mine') {
    this.doMine();
  } else if(this.memory.mode == "goto") {
    this.goto();
  } else if(this.memory.mode == 'store') {
    this.doStore();
  }
}

Creep.prototype.goto = function(x, y) {
  if(x) {
    this.memory.goto_x = x
  }
  if(y) {
    this.memory.goto_y = y
  }
  x = this.memory.goto_x
  y = this.memory.goto_y
  if (x == this.pos.x && y == this.pos.y) {
    this.memory.mode = this.memory.before_goto_mode || 'idle'
    delete this.memory.before_goto_mode
  } else {
    if (this.memory.mode == 'goto') {
      this.moveTo(x, y)
    } else {
      this.memory.before_goto_mode = this.memory.mode
      this.memory.mode = 'goto'
    }
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 20:51:54
*/

'use strict';

Creep.prototype.assignHarvesterTasks = function() {
  if(!this.memory.mode) {
    this.memory.mode = 'idle'
  }
  if(this.memory.mode == 'idle') {
    if(this.carry.energy < this.carryCapacity) {
      this.memory.mode = 'mine';
    } else {
      this.memory.mode = 'store';
    }
  }
}

Creep.prototype.doMine = function() {
  if(!this.memory.assigned_position) {
    this.findSourcePosition()
  } else {
    this.goto(this.memory.assigned_position.x, this.memory.assigned_position.y)
  }
}

Creep.prototype.doStore = function() {
  Object.keys(this.memory.my_spawns).forEach(function(key, index) {
      var spawn = Game.getObjectById(this[key].id);
      if(spawn.energy < spawn.energyCapacity) {

      }
    }, this.memory.my_spawns);
}

Creep.prototype.findSourcePosition = function() {
  creep = this
  if(this.room.memory.sources) {
    Object.keys(this.room.memory.sources).some(function(key, index) {
      position = this.room.memory.sources[key]
      if(!position.taken) {
        creep.room.memory.sources[key].takes = true
        creep.memory.assigned_position = creep.room.memory.sources[key]
        return true
      }
    }, this.room.memory.sources);
  }
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 18:03:01
*/

'use strict';

StructureSpawn.prototype.getHarvesterBody = function(){
  var energy = this.room.energyAvailable;
  if (energy >= 300 && energy < 550) {
    return [WORK, CARRY, CARRY, MOVE, MOVE]
  } else {
    return [WORK, CARRY, MOVE]
  }
}
StructureSpawn.prototype.harvesters = function() {
  return this.memory.current_harvesters || 0
}

StructureSpawn.prototype.maxHarvesters = function() {
  return this.memory.max_harvesters || 0
}

StructureSpawn.prototype.setMaxHarvesters = function() {
  this.memory.max_harvesters = 2
}
StructureSpawn.prototype.setHarvesters = function() {
  var count = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
  this.memory.current_harvesters = count;
}

StructureSpawn.prototype.spawnHarvester = function() {
  this.createCreep(this.getHarvesterBody(), null, {role: 'harvester', mode: 'idle'})
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:40:25
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 17:14:57
*/

'use strict';

var Log = {
  info: function(message) {
    if (logLevel >= 4) {
      console.log('<span style="color: #66D9EF">' + message + '</span>');
    }
  },

  warn: function(message) {
    if (logLevel >= 3) {
      console.log('<span style="color: #E6961F">' + message + '</span>');
    }
  },
  error: function(message) {
    if (logLevel >= 2) {
      console.log('<span style="color: #D8232E">' + message + '</span>');
    }
  },

  critical: function(message) {
    if (logLevel >= 1) {
      console.log('<span style="color: #FF0000">' + message + '</span>');
    }
  }
}
module.exports = Log;
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:39:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 20:07:18
*/

'use strict';


Room.prototype.tick = function() {
  Log.info('Ticking Room: ' + this.name + ": " + this.memory.refresh_count);
  this.refreshData();
  this.tickSpawns();
  this.tickCreeps();
  return true;
};

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
    this.findSourceSpots();
  }
  this.memory.refresh_count -= 1;
}

Room.prototype.reset = function() {
  this.memory.refresh_count = -1;
}

Room.prototype.findSourceSpots = function() {
  var room = this;
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
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:31:08
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 16:57:12
*/

'use strict';

RoomObject.prototype.tick = function() {
  return true; // No need to tick every last little thing.
  // body...
};
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 05:53:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 17:59:40
*/

'use strict';

StructureSpawn.prototype.tick = function() {
  Log.info('Ticking Spawn: ' + this.name + ' Mode: ' + this.memory.mode + " - " + this.memory.refresh_count);
  this.assignMode();
  this.doWork();
  this.refreshData();
}

StructureSpawn.prototype.refreshData = function() {
  if(!this.memory.refresh_count || this.memory.refresh_count <= 0) {
    this.memory.refresh_count = 70;
    this.setMaxHarvesters()
  }
  this.memory.refresh_count -= 1;
}

StructureSpawn.prototype.assignMode = function() {
  if(!this.memory.mode) {
    Log.warn("No current mode for Spawn " + this.name)
    this.memory.mode = 'idle'
  }
  if(!this.memory.mode || this.memory.mode == 'idle') {
    if(this.room.energyAvailable >= this.room.energyCapacityAvailable) {
      this.memory.mode = 'spawn'
    } else {
      this.memory.mode = 'idle'
    }
  } else if (this.memory.mode == 'spawning' && this.spawning == null ) {
      this.memory.mode = 'idle'
  }
}

StructureSpawn.prototype.doWork = function() {
  if(this.memory.mode == 'spawn') {
    this.spawnCreep();
  }
}

StructureSpawn.prototype.spawnCreep = function() {
  // What kind of creep
  if (this.harvesters() <= this.maxHarvesters()) {
    this.spawnHarvester();
  }
  this.memory.mode = 'spawning'
}
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 06:00:56
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 11:49:32
*/

'use strict';

var logLevel = 4; //show it all

module.exports.loop = function () {
  Object.keys(Game.rooms).forEach(function(key, index) {
    this[key].tick();
  }, Game.rooms);
    //new Spawner(Game.spawns.Spawn1).tick();
    /*_.filter(Game.creeps).forEach(function(creep) {
      creep.tick();
    });*/
  };
