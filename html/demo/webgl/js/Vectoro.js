const Vectoro = {
	copy: function( v ) {
		return [ v[ 0 ], v[ 1 ], v[ 2 ] ];
	}
	, scale: function( s, v ) {
		return [ v[ 0 ] * s, v[ 1 ] * s, v[ 2 ] * s ];
	}
	, normalize: function( v ) {
		let length = Vectoro.length( v );
		if ( 0 === length ) {
			length = 1;
		}
		return Vectoro.scale( 1 / length, v );
	}
	, length: function( v ) {
		return Math.sqrt( Vectoro.length2( v ) );
	}
	, length2: function( v ) {
		return Vectoro.dot( v, v );
	}
	, distance: function( v, u ) {
		return Math.sqrt( Vectoro.distance2( v, u ) );
	}
	, distance2: function( v, u ) {
		return Vectoro.length2( Vectoro.subtract( v, u ) );
	}
	, dot: function( v, u ) {
		return ( v[ 0 ] * u[ 0 ] + v[ 1 ] * u[ 1 ] + v[ 2 ] * u[ 2 ] );
	}
	, cross: function( v, u ) {
        return [
			  v[ 1 ]*u[ 2 ] - v[ 2 ]*u[ 1 ] // x = v.y * u.z - v.z - u.y <-- xyzzy
			, v[ 2 ]*u[ 0 ] - v[ 0 ]*u[ 2 ] // y = v.z * u.x - v.x - u.z
			, v[ 0 ]*u[ 1 ] - v[ 1 ]*u[ 0 ] // z = v.x * u.y - v.y - u.x
        ];
	}
	, subtract: function( v, u ) {
		return [ v[ 0 ] - u[ 0 ], v[ 1 ] - u[ 1 ], v[ 2 ] - u[ 2 ] ];
	}
	, normalVector: function( v0, v1, v2 ) {
		return Vectoro.cross( 
			Vectoro.normalize( Vectoro.subtract( v0, v1 ) )
			, Vectoro.normalize( Vectoro.subtract( v2, v1 ) )
			);
	}
	, add: function( v, u ) {
		return [ v[ 0 ] + u[ 0 ], v[ 1 ] + u[ 1 ], v[ 2 ] + u[ 2 ] ];
	}
	, toString: function( v, precision ) {
		precision = Util.idk( precision, 1000 );
		return (
			'('
			+ Math.floor( v[ 0 ] * precision ) / precision 
			+ ','
			+ Math.floor( v[ 1 ] * precision ) / precision 
			+ ','
			+ Math.floor( v[ 2 ] * precision ) / precision 
			+ ')'
		);
	}
};
