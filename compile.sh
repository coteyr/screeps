#!/bin/sh
# @Author: Robert D. Cotey II <coteyr@coteyr.net>
# @Date:   2016-06-26 05:59:51
# @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
# @Last Modified time: 2016-11-12 11:19:01
rm main.js
cat src/*.js >> main.js
cat src/**/*.js >> main.js
cp main.js /home/coteyr/.config/Screeps/scripts/screeps.com/default/
cp screeps-profiler.js /home/coteyr/.config/Screeps/scripts/screeps.com/default/

# node ./upload.js

cp main.js /home/coteyr/.config/Screeps/scripts/games_coteyr_net___21050/default/
cp screeps-profiler.js /home/coteyr/.config/Screeps/scripts/games_coteyr_net___21050/default/
cp notify.js /home/coteyr/.config/Screeps/scripts/games_coteyr_net___21050/default/
