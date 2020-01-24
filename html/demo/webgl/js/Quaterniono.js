// https://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
// https://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/transforms/index.htm
// https://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/functions/index.htm
// https://openhome.cc/Gossip/WebGL/samples/Quaternion-1.html

// [x,y,z,w];
const Quaterniono = {
	set:function( x, y, z, w ) {
		w = Utilo.idk( w, 0 );
		return [ x, y, z, w ];
	}
	, rotate: function( angle, q ) {
		const s = Math.sin( angle / 2 );
		return [ q[ 0 ] * s, q[ 1 ] * s, q[ 2 ] * s, Math.cos( angle / 2 ) ]
	}
	, rotatePoint: function( q, p ) {
		return Quaterniono.multiply( 
			  Quaterniono.multiply( q, p )
			, Quaterniono.conjugate( q )
		);
	}
	, conjugate: function( q ) {
		return [ -q[ 0 ], -q[ 1 ], -q[ 2 ], q[ 3 ] ];
	}
	, multiply: function( q, p ) {
		return [
			   q[ 0 ] * p[ 3 ] + q[ 1 ] * p[ 2 ] - q[ 2 ] * p[ 1 ] + q[ 3 ] * p[ 0 ]
			, -q[ 0 ] * p[ 2 ] + q[ 1 ] * p[ 3 ] + q[ 2 ] * p[ 0 ] + q[ 3 ] * p[ 1 ]
			,  q[ 0 ] * p[ 1 ] - q[ 1 ] * p[ 0 ] + q[ 2 ] * p[ 3 ] + q[ 3 ] * p[ 2 ]
			, -q[ 0 ] * p[ 0 ] - q[ 1 ] * p[ 1 ] - q[ 2 ] * p[ 2 ] + q[ 3 ] * p[ 3 ]
		]
	}
	, toMatrix: function( q ) {
		const x = q[ 0 ];
		const y = q[ 1 ];
		const z = q[ 2 ];
		const w = q[ 3 ];

		// from https://openhome.cc/Gossip/WebGL/samples/Quaternion-1.html
		const x2 = x + x;
		const y2 = y + y;
		const z2 = z + z;

		const xx = x * x2;
		const yx = y * x2;
		const yy = y * y2;
		const zx = z * x2;
		const zy = z * y2;
		const zz = z * z2;
		const wx = w * x2;
		const wy = w * y2;
		const wz = w * z2;
		return [
			1 - yy - zz,     yx + wz,        zx - wy,       0,
			yx - wz,         1 - xx - zz,    zy + wx,       0,
			zx + wy,         zy - wx,        1 - xx - yy,   0,
			0,               0,              0,             1
		];
	}
	, slerp: function( q, p, t ) {
		// from https://en.wikipedia.org/wiki/Slerp
		// Only unit quaternions are valid rotations.
		// Normalize to avoid undefined behavior.
		let v0 = Quaterniono.normalize( q );
		let v1 = Quaterniono.normalize( p );

		// Compute the cosine of the angle between the two vectors.
		let dot = Quaterniono.dot( v0, v1 );

		// If the dot product is negative, slerp won't take
		// the shorter path. Note that v1 and -v1 are equivalent when
		// the negation is applied to all four components. Fix by
		// reversing one quaternion.
		if (dot < 0.0) {
			v1 = Quaterniono.scale( 1, v1 );
			dot = -dot;
		}

		const DOT_THRESHOLD = 0.9995;
		if (dot > DOT_THRESHOLD) {
			// If the inputs are too close for comfort, linearly interpolate
			// and normalize the result.
			return Quaterniono.normalize(
				Quaterniono.add( 
					v0,
					Quaterniono.scale( t, Quaterniono.subtract( v1, v0 ) )
				)
			);
		}

		// Since dot is in range [0, DOT_THRESHOLD], acos is safe
		const theta_0     = Math.acos( dot );    // theta_0 = angle between input vectors
		const theta       = theta_0 * t;         // theta = angle between v0 and result
		const sin_theta   = Math.sin( theta );   // compute this value only once
		const sin_theta_0 = Math.sin( theta_0 ); // compute this value only once

		const s0 = Math.cos(theta) - dot * sin_theta / sin_theta_0;  // == sin(theta_0 - theta) / sin(theta_0)
		const s1 = sin_theta / sin_theta_0;

		return Quaterniono.add(
			Quaterniono.scale( s0, v0 ),
			Quaterniono.scale( s1, v1 )
		);
	}
	, normalize: function( q ) {
		const length = Quaterniono.length( q );
		return (
			0 === length 
			? q 
			: Quaterniono.scale( 1 / length, q )
		);
	}
	, length: function( q ) {
		return Math.sqrt( Quaterniono.dot( q, q ) );
	}
	, scale: function( s, q ){
		return [
			q[ 0 ] * s, 
			q[ 1 ] * s, 
			q[ 2 ] * s, 
			q[ 3 ] * s  
		];
	}
	, dot: function( q, p ) {
		return [
			q[ 0 ] * p[ 0 ] +
			q[ 1 ] * p[ 1 ] +
			q[ 2 ] * p[ 2 ] +
			q[ 3 ] * p[ 3 ]  
		];
	}
	, add: function( q, p ){
		return [
			q[ 0 ] + p[ 0 ],
			q[ 1 ] + p[ 1 ],
			q[ 2 ] + p[ 2 ],
			q[ 3 ] + p[ 3 ]
		];
	}
	, subtract: function( q, p ){
		return [
			q[ 0 ] - p[ 0 ],
			q[ 1 ] - p[ 1 ],
			q[ 2 ] - p[ 2 ],
			q[ 3 ] - p[ 3 ]
		];
	}
};
