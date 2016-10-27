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

 - **litewalls** Cheap wall destroyers for when there are small walls and no towers, less important now that noob walls don't exist.

 - **Drain Tower** A bunch of mid range creeps meant to drain a poorly fed tower by tanking the damage. Many creeps lost, but they are cheap.

 - **swarm** Very cheap units that take advantage of the fact that a tower needs two hits to destroy the attacking creeps. Will drain a tower but is most useful with no walls and a poor tower, or no walls and no towers.

 - **kite** Mid Range units that kite enemies that focus on ATTACK attacks. Just a couple of these can destroy an entire army of ATTACK only creep. Not for use on towers or walls.

 - **heavy** Beefy creeps with heals that are meant to tank a bit. Can tank a small tower, but mostly used to take on other creep armies.

 - **noob-tower** Extremely cheap creeps that take advantage of the energy cost of defending by tower. A bunch of these file in and essentially drain the target economy till it can no longer support the towers. Works against targets defending by tower only. Specially ones that divert 100% of energy to towers while under attack.

 - **drain** Mid cost creeps that can tank a tower for a moment. Their goal is to drain a tower. This works best when there is one tower, and the target room layout allows for easy "edge dancing"

 - **stream** 50 Energy crepes that go one in a time. Essentially they try to crash the target economy by forcing tower defense or causing them to over build an army. Works very well against targets that spawn static high cost armies. They spend 10,000 energy to defend against your 50 energy creeps. Can drain a poorly coded tower. Requires a good source economy. Also works against the target's CPU.

 - **block** Creates cheap creeps to essentially block the target from accessing their spawner. Works well against noobs that don't have attack creep code yet. Useless against targets that attack with creeps or towers. This is basically non-lethal harassment.

 - **post** A squad of creeps that "pushes back" attacking creeps, room by room.  Used if a attacker is sending a stream of creeps to harass remote mining. This can push them back to just outside their origination room. Also works to prevent remote mining.

# Game Constants

# My Constants
  - **LOCAL_RECYCLE_AGE** When less time to live then this, try and recycle. This needs to exceed possible spawn time or you could run into a starvation situation.
  - **REMOTE_RECYCLE_AGE** When less time to live while working with remote creeps, try and recycle. This needs to be large enough for the creeps to get back. Claimers and Reserves are immune to this cause of their low life time.

# Alarms

# Global Commands
