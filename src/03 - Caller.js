/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-15 21:47:04
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-15 21:50:40
*/

'use strict';

let Caller = function(scope, functionName){
  var fn = scope[functionName]
  if(typeof fn === 'function') {
    eval('scope.' + functionName + '()')               ;
  } else {
    Log.error("Function " + functionName + " not found in " + typeof scope)
  }
};
