#!/bin/sh
# @Author: Robert D. Cotey II <coteyr@coteyr.net>
# @Date:   2016-06-26 05:59:51
# @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
# @Last Modified time: 2017-07-30 03:13:24
rm main.js
cat src/**/**/*.js >> main.js
cat src/**/*.js >> main.js
cat src/*.js >> main.js

cp main.js /home/coteyr/.config/Screeps/scripts/screeps.com/default/
cp screeps-profiler.js /home/coteyr/.config/Screeps/scripts/screeps.com/default/

node ./upload.js

cp main.js /home/coteyr/.config/Screeps/scripts/games_coteyr_net___21025/default
cp screeps-profiler.js /home/coteyr/.config/Screeps/scripts/games_coteyr_net___21025/default
cp notify.js /home/coteyr/.config/Screeps/scripts/games_coteyr_net___21025/default

cp main.js /home/coteyr/.config/Screeps/scripts/127_0_0_1___21025/default
cp screeps-profiler.js /home/coteyr/.config/Screeps/scripts/127_0_0_1___21025/default
cp notify.js /home/coteyr/.config/Screeps/scripts/127_0_0_1___21025/default

cp main.js /home/coteyr/.config/Screeps/scripts/screeps___21025/default
cp screeps-profiler.js /home/coteyr/.config/Screeps/scripts/screeps___21025/default
cp notify.js /home/coteyr/.config/Screeps/scripts/screeps___21025/default
