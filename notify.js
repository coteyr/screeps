
var Notify = function (subject, description="", priority=0, url="http://screeps.com", limit=0) {

  let message = {subject: subject, description: description, priority: priority, url: url}
  // If no limit then send immediately (and potentially repeatedly)
  if(!limit) {
    Notify.queueMessage(message)
    return
  }

  // In cases where there are limits we have to record the history.

  if(!Memory.__notify_history) {
    Memory.__notify_history = {}
  }

  // If the message was sent in the last LIMIT ticks then don't send again.
  if(!!Memory.__notify_history[message]) {
    var lastSent = Memory.__notify_history[message]
    if(lastSent >= Game.time - limit) {
      return
    } else {
      // History is older than limit so delete it.
      delete Memory.__notify_history[message]
    }
  }

  // Record message in history and send it.
  Memory.__notify_history[message] = Game.time
  Notify.queueMessage(message)
  return 0
}


Notify.queueMessage = function (message) {
  if(!Memory.__notify) {
    Memory.__notify = []
  }
  Memory.__notify.push({
    'message': message,
    'tick': Game.time
  })
}

// Clean up history instead of leaving old messages around
Notify.cleanHistory = function (limit) {
  if(!limit) {
    limit = 20000
  }

  if(!Memory.__notify_history) {
    return
  }

  var messages = Object.keys(Memory.__notify_history)
  for(var i in messages) {
    var message = messages[i]
    if(Memory.__notify_history[message] < Game.time - limit) {
      delete Memory.__notify_history[message]
    }
  }
}


module.exports = Notify
