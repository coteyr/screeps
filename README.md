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
  - **LOCAL_RECYCLE_AGE** When less time to live then this, try and recycle. This needs to exceed possible spawn time or you could run into a starvation situation.
  - **REMOTE_RECYCLE_AGE** When less time to live while working with remote creeps, try and recycle. This needs to be large enough for the creeps to get back. Claimers and Reserves are immune to this cause of their low life time.

# Alarms

# Global Commands
