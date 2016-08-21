/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-08-19 18:38:41
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-19 19:40:03
*/

'use strict';

var Caching = {
  cache: function(key, func, timeout) {
    if( Object.prototype.toString.call(key) === '[object Array]' ) key = this.buildKey(key)
    if(!timeout) timeout = 5
    var values = this.getCacheItems(key)
    if(!values) values = this.storeCacheItems(key, func, timeout)
    var results = []
    values.forEach(function(v){
      results.push(Game.getObjectById(v))
    })
    return results
  },
  getCacheItems: function(key) {
    if(Memory.cache[key]) {
      var timeout = Memory.cache[key].timeout
      if(Game.time <= timeout){
        return Memory.cache[key].values
      }
    }
  },
  storeCacheItems: function(key, func, timeout) {
    if(!Memory.cache) Memory.cache = {}
    var result = func
    var thin = []
    result.forEach(function(r){
      thin.push(r.id)
    })
    var store = {timeout: Game.time + timeout, values: thin}
    Memory.cache[key] = store
    return Memory.cache[key].values
  },
  buildKey(keys){
    var k = ""
    keys.forEach(function(i){
      k += i
      k += '-'
    })
    return k.slice(0, -1)
  }



}

