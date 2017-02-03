/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-02 22:42:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-02 22:49:56
*/

'use strict';

StructureSpawn.prototype.spawn = function() {
  let id = Counter.number()
  let body = [WORK, MOVE, CARRY]
  if (this.canCreateCreep(body, id) === OK) {
    this.createCreep(body, id, {task: 'idle'})
    Log.info(['Spawning Creep at', this.name])
  }
}
