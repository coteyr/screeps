# screeps
My Screeps setup. A fun way to stay sharp on non-browser based javascript stuff. My goal is to create a code base / AI that can handle the game on it's own with little interference from the outside. Currently I want to manually place structures, but other then that the code base should do all the work.


<a href="https://codeclimate.com/github/coteyr/screeps"><img src="https://codeclimate.com/github/coteyr/screeps/badges/gpa.svg" /></a>

# A few notes
To anyone that stumbles across this. Screeps is a game where you focus on automating your creeps using code you write your self. There are some unique restrictions and catches that you have to work around. Some of them are listed below

# Catches

  - Your limited in the amount of *CPU* you can use per tick
  - The CPU limit is a semi-fake unit that measures real CPU time.
  - Requiring files generally has a very large overhead in CPU time.
  - Requiring files can some times "break" if something that we have no control over is very busy. It seems like disk IO, but I have been told it's not.
  - The order you put creep body parts in matters

# Mentionable Classes

  - **Formatter** In an effort to contain all the nasty "'foo = " + bar + " baz'" type string building, specially when referring to css for output the Formatter class is used. Hopefully this will restrict that hard to read gloop to one file.
  - **Log** A single log class exists to format and unify all logging functions. Static methods exist for ease of use, and log levels are set in the *Config* object.
  - **Time** The time class is designed to handle both world time and screeps time.
  - **Storage** The storage class is meant to hold all memory access methods. The reason being that Memory.foo.bar some times needs to be adjusted to be Memory.foo_bar for performance reasons. Other memory storage needs like defaults are also handled.

# Config
All config variables should be stored in Config.js, in JSON format.
