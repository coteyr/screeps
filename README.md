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

# Roles

# Exo-Roles

# Army

# Tactics

# Game Constants

# My Constants

# Alarms

# Global Commands
