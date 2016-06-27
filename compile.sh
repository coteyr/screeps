#!/bin/sh
# @Author: Robert D. Cotey II <coteyr@coteyr.net>
# @Date:   2016-06-26 05:59:51
# @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
# @Last Modified time: 2016-06-26 16:39:11
rm main.js
cat src/* >> main.js
cp main.js /home/coteyr/.config/Screeps/scripts/screeps.com/default/
