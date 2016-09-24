/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-09-19 13:51:50
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-19 14:03:15
*/

'use strict';

let EnergyHaulingCreep = function() {}
_.merge(EnergyHaulingCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype, LocalCreep.prototype)

// -> checked-dropped -> goto -> pickup -> choose ->
//           -> select -> position -> fill        -> choose ->
EnergyHaulingCreep.prototype.energyState = function() {
  if(!this.state()) this.setState('check-dropped')
  if(this.stateIs('check-dropped')) Actions.targetWithState(this, Finder.findExclusiveDropedEnergy(this.room.name), 'goto', 'select')
  if(this.stateIs('goto')) Actions.moveToTarget(this, this.target(), 'pickup', 1, 'check-dropped')
  if(this.stateIs('pickup')) Actions.pickup(this, this.target(), 'choose')
  if(this.stateIs('select')) Actions.targetWithState(this, Targeting.findEnergySource(this.pos, this.room, this.memory.role), 'position', 'check-dropped')
  if(this.stateIs('position')) Actions.moveToTarget(this, this.target(), 'fill')
  if(this.stateIs('fill')) Actions.grab(this, this.target(), 'choose', 'check-dropped')
}
