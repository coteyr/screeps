/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:39:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 11:39:26
*/

'use strict';

Room.prototype.tick = function() {
  return true;
};
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:31:08
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 11:31:55
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
* @Last Modified time: 2016-06-26 11:25:22
*/

'use strict';
/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 06:00:56
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 11:38:21
*/

'use strict';

module.exports.loop = function () {
  Object.keys(Game.rooms).forEach(function(key, index) {
    this[key].tick();
  }, Game.rooms);
    //new Spawner(Game.spawns.Spawn1).tick();
    /*_.filter(Game.creeps).forEach(function(creep) {
      creep.tick();
    });*/
  };
