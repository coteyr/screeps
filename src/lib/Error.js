/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-12 21:38:54
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-14 13:51:38
*/

'use strict';

class Error {
  static niceError(error) {
    let message = error
    switch(error) {
      case ERR_NOT_OWNER:
      message = "You do not own that object"
      break;
      case ERR_NO_PATH:
      message = "Could not find path"
      break;
      case ERR_NAME_EXISTS:
      message = "Name already exists"
      break;
      case ERR_BUSY:
      message = "Object is busy"
      break;
      case ERR_NOT_FOUND:
      message = "Object could not be found"
      break;
      case ERR_NOT_ENOUGH_ENERGY:
      message = "Not enough Energy"
      break;
      case ERR_NOT_ENOUGH_RESOURCES:
      message = "Not Enough Resources"
      break;
      case ERR_INVALID_TARGET:
      message = "Invalid Target"
      break;
      case ERR_FULL:
      message = "Object Full"
      break;
      case ERR_NOT_IN_RANGE:
      message = "Object not in range"
      break;
      case ERR_INVALID_ARGS:
      message = "Invalid Arguments passed to API"
      break;
      case ERR_TIRED:
      message = "To tired"
      break;
      case ERR_NO_BODYPART:
      message = "No Body part to execute that action"
      break;
      case ERR_NOT_ENOUGH_EXTENSIONS:
      message = "Not enough extensions"
      break;
      case ERR_RCL_NOT_ENOUGH:
      message = "RCL Level is not high enough"
      break;
      case ERR_GCL_NOT_ENOUGH:
      message = "GCL level is not high enough"
      break;
    }
    return error
  }
  static worked(returnValue, object = null) {
    if(returnValue === OK) return true
    Error.logError(returnValue, object)
    return false
  }
  static logError(returnValue, object = null) {
    let name = "Unknown"
    if(!_.isNull(object) && !_.isUndefined(object) && !_.isUndefined(object.name)) name = object.name
    if(!_.isNull(object) && !_.isUndefined(object) && !_.isUndefined(object.room)) name = object.room.name
    if(returnValue === OK) {
      Log.debug('OK')
    } else {
      Log.error(['Error Processing Command:', Formatter.color(Config.colors.purple, Error.niceError(returnValue))], name)
    }
  }
}
