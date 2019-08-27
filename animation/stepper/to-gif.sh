#!/bin/bash	

export DELAY=25

_to_gif_main() {
	local pngs=$( ( ls *png | sort -n ; ls *png | sort -nr ) | uniq )
	pngs=$( ls *png | sort -n )
	echo convert -delay ${DELAY} -loop 0 -alpha set -dispose previous ${pngs} stepper.gif
	convert -delay ${DELAY} -loop 0 -alpha set -dispose previous ${pngs} stepper.gif
}

_to_gif_main ${*}
