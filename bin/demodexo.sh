#!/bin/bash	

_demodexo_main() {
	local demo
	for demo in $( _demodexo_find ) ; do
		_demodexo_each ${demo}
	done
}

_demodexo_each() {
	local demo=${1} ; shift

	awk -v demo=${demo} '
		function out( href, text ) {
			printf( "\t\t\t\t<li><a href=\"%s\">%s</a></li>\n", href, text );
		}

		tolower($0) ~ /<title>/ {
			while( sub( /<[^>]*>/, "" ) );
			sub( /^[ \t]*/, "" );
			sub( /[ \t]*$/, "" );
			description = $0;

			partial = demo;
			sub( /.*\//, "", partial );
			sub( /\.html$/, "", partial );

			if ( DEBUG ) {
				printf( "d:\"%s\", p:\"%s\", l:\"%s\"\n", demo, partial, description );
			}

			if ( description == partial ) {
				out( demo, demo );
			} else {
				out( demo, demo ": " description );
			}
			
		}
	' ${demo}
}

_demodexo_find() {
	find . -type f -name '*.html' \
	| sort \
	| sed 's,^\./,,' \
	| egrep -v '(/node_modules/|^index.html$|/webgl/)' 
}

_demodexo_main ${*}
