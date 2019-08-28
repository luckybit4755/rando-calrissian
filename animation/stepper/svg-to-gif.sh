#!/bin/bash
############################################################################################
#
# This script will parse svg files looking for inkscape layers with an label that starts
# with "frame". It extracts each frame into a separate temporary png and uses Imagemagick
# convert to create an animated gif from them.
#
# Usage: svg-to-gif.sh fun.svg
#
# Currently, it assumes the frames make a complete loop, but I may add support for loops 
# like "1,2,3,4,3,2,1" at some point 
#
# By default, the frame delay is set to 23, but this can be overwritten by setting the 
# DELAY environment variable for the script.
#
# By default, the script will not automatically overwrite a gif (user is prompted), but
# if the CLOBBER environment variable is set, then it will overwrite without promting.
#
# see https://how-to.fandom.com/wiki/How_to_use_Inkscape_in_commandline_mode/List_of_verbs
# see https://stackoverflow.com/questions/9652573/inkscape-command-line-programming
#
# @author Valerie Hammond
#
############################################################################################

export DELAY=${DELAY-23}

##
 #
 # Use xsl to pull out the name of inkscape layers with a label that starts
 # with "frame". Export each layer to an individual temporary png file
 # Put the png files together into and an animated gif and remove the temporary
 # files
 #
 # @parameter svg file to parse
 # @output animated gif based on the name of the svg file passed in
 #
 ##
_svg_to_gif_file() {
	local svg=${1}
	local frame

	_svg_to_gif_line

	# create a prefix for the temporary pngs files
	local prefix=tmp-${PPID}-${$}
	for ((i=0;i<4;i++)) ; do
		prefix=${prefix}-${RANDOM}
	done

	_svg_to_gif_message NFO "processing ${svg}"
	_svg_to_gif_message NFO "temporary file prefix is ${prefix}"

	# export each layer in the svg with and inkscape label that starts with "frame"
	for frame in $( _svg_to_gif_list_frame_layers ${svg} ) ; do
		local id=$( echo ${frame} | cut -f1 -d: )
		local frame=$( echo ${frame} | cut -f2 -d: )
		local tmp=${prefix}-${frame}.png
	
		_svg_to_gif_message NFO "exporting ${id} to ${tmp}"

		# export the layer
		inkscape ${svg} --export-area-drawing --export-id-only --export-id=${id} --export-png=${tmp} \
		|| return 33
	done

	# get a list of the png files exported
	# the frames are sorted numerically, and it's expected
	# they will make a complete list, may add support for half-loops at some point..
	local pngs=$( ls ${prefix}*.png | sort -n )
	if [ "" = "${pngs}" ] ; then
		_svg_to_gif_message ERR "no files to make into a gif... sorry"
		return
	fi

	# name the gif based of the svg filename and try to avoid smashing things unless asked
	local gif=$( basename ${svg} | sed 's/\.svg$/.gif/' )
	if [ -f ${gif} ] ; then
		if [ "" = "${CLOBBER}" ] ; then
			echo
			echo -n "overwrite the file ${gif} [N/y]? "
			read x
			if [ "y" != "${x}" ] ; then
				echo "not clobbering ${gif}"
				rm -f ${pngs}
				return 0
			fi

			_svg_to_gif_message NFO "you can set the environment variable 'CLOBBER' to automatically overwrite files"
		else
			_svg_to_gif_message NFO "CLOBBER is set, so overwriting ${gif}"
		fi
	fi

	# create the animated gif
	convert -delay ${DELAY} -loop 0 -alpha set -dispose previous ${pngs} ${gif} \
	&& _svg_to_gif_message NFO "created ${PWD}/${gif}" \
	|| _svg_to_gif_message ERR "failed to create ${gif}"

	# remove the temporary png files
	rm -f ${pngs}

	_svg_to_gif_message NFO "removed temporary files"
	_svg_to_gif_message NFO "finished processing ${svg}"
}

##
 #
 # for each svg file invoke _svg_to_gif_file
 #
 # @parameter list of svg filenames
 # @output animated gif for each svg
 #
 ##
_svg_to_gif_main() {
	local svg 
	for svg in ${*} ; do
		_svg_to_gif_file ${svg}
	done
}

##
 #
 # Use xsl to pull out the name of inkscape layers with a label that starts
 # with "frame". 
 #
 # @parameter svg filename to parse
 # @output list of "id":"name" pairs
 #
 ##
_svg_to_gif_list_frame_layers() {
	_svg_to_gif_list_frame_layers_xslt | xsltproc - ${1}
}

##
 #
 # the xsl to pull out the name of inkscape layers with a label that starts
 # with "frame". 
 #
 ##
_svg_to_gif_list_frame_layers_xslt() {
cat << X
<?xml version="1.0"?>
<xsl:stylesheet  
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    version="1.0"
    xmlns:lxslt="http://xml.apache.org/xslt"
	xmlns:svg="http://www.w3.org/2000/svg"
	xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
>
	<xsl:output method="text" indent="no" encoding="UTF-8" standalone="no"/>

	<!-- eat all the text -->
	<xsl:template match="text()"/> 

	<!-- match: <g inkscape:groupmode="layer" id="layer2" inkscape:label="frame... guys -->
	<xsl:template match="svg:g[@inkscape:groupmode='layer' and starts-with(@inkscape:label, 'frame')]">
		<xsl:value-of select="./@id"/>               <!-- id is used to tell inkscape what to export -->
		<xsl:text>:</xsl:text>
		<xsl:value-of select="./@inkscape:label"/>   <!-- label is a friendlier name used for ordering -->
		<xsl:text>&#xa;</xsl:text>
	</xsl:template>
</xsl:stylesheet>
X
}

##
 #
 # echo some info to the terminal in a handy way
 #
 ##
_svg_to_gif_message() {
	echo "SVG_TO_GIF: $( date +"%Y.%m.%d_%H.%M.%S" ) ${*}"
}

##
 #
 # print a nice horizontal line
 #
 ##
_svg_to_gif_line() {
	awk 'BEGIN{for(i=0;i<77;i++)l=l"-";print l}'
}

##
 #
 # invoke the main method
 #
 ##
_svg_to_gif_main ${*}

############################################################################################
# Next line of hash marks is EOF
############################################################################################
