#!/bin/bash	

_luv_main() {
	awk 'BEGIN{s="Valerie Loves Dieter"; l = length( s ); q = ""; print s; for ( i = 0 ; i < l ; i++) { for ( j = 0 ; j < i + n; j++ ) q = q " "; print q s; }   }'
}

_luv_main ${*}
