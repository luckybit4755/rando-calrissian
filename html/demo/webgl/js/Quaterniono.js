// https://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
// https://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/transforms/index.htm
// https://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/functions/index.htm

// [x,y,z,w];
const Quaterniono = {
	position:function( x, y, z ) {
		return [ x, y, z, 0 ];
	}
	, rotate: function( angle, q ) {
		// q = cos(a/2) + (i x + j y + k z)sin(a/2)
		let s = Math.sin( angle / 2 );
		let c = Math.cos( angle / 2 );
		return [ q[ 0 ] * s, q[ 1 ] * s, q[ 2 ] * s, q[ 3 ] * c ]
	}
	, rotatePoint: function( q, p ) {
		//, q * p * conj(q)
		return Quaterniono.multiply( 
			  Quaterniono.multiply( q, p )
			, Quaterniono.conjugate( q )
		);
	}
	, conjugate: function( q ) {
		//	conj(a + b i + c j + d k) = a - b i - c j - d k
		return [ -q[ 0 ], -q[ 1 ], -q[ 2 ], q[ 3 ] ];
	}
	, normalize: function( q ) {
		return Vectoro.normalize( q );
	}
	, scale: function( s, q ) {
		return Vectoro.scale( s, q );
	}
	, multiply: function( q, p ) {
		[
    		   p[ 0 ] * p2[ 3 ] + p[ 1 ] * p2[ 2 ] - p[ 2 ] * p2[ 1 ] + p[ 3 ] * p2[ 0 ]
    		, -p[ 0 ] * p2[ 2 ] + p[ 1 ] * p2[ 3 ] + p[ 2 ] * p2[ 0 ] + p[ 3 ] * p2[ 1 ]
    		,  p[ 0 ] * p2[ 1 ] - p[ 1 ] * p2[ 0 ] + p[ 2 ] * p2[ 3 ] + p[ 3 ] * p2[ 2 ]
    		, -p[ 0 ] * p2[ 0 ] - p[ 1 ] * p2[ 1 ] - p[ 2 ] * p2[ 2 ] + p[ 3 ] * p2[ 3 ]
		]
	}
}



};
