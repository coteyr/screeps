/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-09-19 13:51:50
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-25 15:56:31
*/

'use strict';

let EnergyHaulingCreep = function() {}
_.merge(EnergyHaulingCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype, LocalCreep.prototype)

// -> checked-dropped -> goto -> pickup -> choose ->
//           -> select -> position -> fill        -> choose ->
EnergyHaulingCreep.prototype.energyState = function() {
  if(!this.state()) this.setState('check-dropped')
  if(this.stateIs('check-dropped')) Actions.targetWithState(this, Finder.findExclusiveDropedEnergy(this.room.name), 'e-goto', 'e-select')
  if(this.stateIs('e-goto')) Actions.moveToTarget(this, this.target(), 'e-pickup', 1, 'check-dropped')
  if(this.stateIs('e-pickup')) Actions.pickup(this, this.target(), 'choose')
  if(this.stateIs('e-select')) Actions.targetWithState(this, Targeting.findEnergySource(this.pos, this.room, this.memory.role), 'e-position', 'check-dropped')
  if(this.stateIs('e-position')) Actions.moveToTarget(this, this.target(), 'e-fill')
  if(this.stateIs('e-fill')) {
    if (this.target() && this.target().mode){
      this.setState('mine')
    } else {
      Actions.grab(this, this.target(), 'choose', 'check-dropped')
    }
  }

}
