const Matrixo = {
	identity: function() {
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	},
	rotateX: function( c, s ) {
		let z = -s;
		return [
			1, 0, 0, 0,
			0, c, z, 0,
			0, s, c, 0,
			0, 0, 0, 1
		];
	},
	rotateY: function( c, s ) {
		let z = -s;
		return [
			c, 0, s, 0,
			0, 1, 0, 0,
			z, 0, c, 0,
			0, 0, 0, 1
		];
	},
	rotateZ: function( c, s ) {
		let z = -s;
		return [
			c, z, 0, 0,
			s, c, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	},
	translate: function( x, y, z ) {
        return [
			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1
		];
    },
    scale: function( x, y, z ) {
		if ( 'undefined' === typeof( y ) ) { y = x }
		if ( 'undefined' === typeof( z ) ) { z = x }
        return [
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1
        ]
    },
	multiply: function( m1, m2 ) {
		return Matrixo.fastMultiply( m1, m2 );
	},
	slowMultiply: function( m1, m2 ) {
		let result = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
		let idx = 0;
		for ( let i = 0 ; i < 4 ; i++ ) {
			for ( let j = 0 ; j < 4 ; j++, idx++ ) {
				let row_m1 = i;
				let col_m2 = j;

				let symbolic = 'result[ ' + idx + ' ] = ';

				let sum = 0;
				for ( let k = 0 ; k < 4 ; k++ ) {
					let col_m1 = k; 
					let row_m2 = k;
					let idx_m1 = row_m1 * 4 + col_m1;
					let idx_m2 = row_m2 * 4 + col_m2;

					sum += m1[ idx_m1 ] * m2[ idx_m2 ];

					symbolic += ' + m1[ ' + idx_m1 + ' ] * m2[ ' + idx_m2 + ' ]';
				}

				result[ idx ] = sum;

				console.log( symbolic ); // I pulled a sneaky!
			}
		}
		return result;
	},
	fastMultiply: function( m1, m2 ) {
		// generated from slowMultiply 
		return [
			m1[  0 ] * m2[ 0 ] + m1[  1 ] * m2[ 4 ] + m1[  2 ] * m2[  8 ] + m1[  3 ] * m2[ 12 ],
			m1[  0 ] * m2[ 1 ] + m1[  1 ] * m2[ 5 ] + m1[  2 ] * m2[  9 ] + m1[  3 ] * m2[ 13 ],
			m1[  0 ] * m2[ 2 ] + m1[  1 ] * m2[ 6 ] + m1[  2 ] * m2[ 10 ] + m1[  3 ] * m2[ 14 ],
			m1[  0 ] * m2[ 3 ] + m1[  1 ] * m2[ 7 ] + m1[  2 ] * m2[ 11 ] + m1[  3 ] * m2[ 15 ],
			m1[  4 ] * m2[ 0 ] + m1[  5 ] * m2[ 4 ] + m1[  6 ] * m2[  8 ] + m1[  7 ] * m2[ 12 ],
			m1[  4 ] * m2[ 1 ] + m1[  5 ] * m2[ 5 ] + m1[  6 ] * m2[  9 ] + m1[  7 ] * m2[ 13 ],
			m1[  4 ] * m2[ 2 ] + m1[  5 ] * m2[ 6 ] + m1[  6 ] * m2[ 10 ] + m1[  7 ] * m2[ 14 ],
			m1[  4 ] * m2[ 3 ] + m1[  5 ] * m2[ 7 ] + m1[  6 ] * m2[ 11 ] + m1[  7 ] * m2[ 15 ],
			m1[  8 ] * m2[ 0 ] + m1[  9 ] * m2[ 4 ] + m1[ 10 ] * m2[  8 ] + m1[ 11 ] * m2[ 12 ],
			m1[  8 ] * m2[ 1 ] + m1[  9 ] * m2[ 5 ] + m1[ 10 ] * m2[  9 ] + m1[ 11 ] * m2[ 13 ],
			m1[  8 ] * m2[ 2 ] + m1[  9 ] * m2[ 6 ] + m1[ 10 ] * m2[ 10 ] + m1[ 11 ] * m2[ 14 ],
			m1[  8 ] * m2[ 3 ] + m1[  9 ] * m2[ 7 ] + m1[ 10 ] * m2[ 11 ] + m1[ 11 ] * m2[ 15 ],
			m1[ 12 ] * m2[ 0 ] + m1[ 13 ] * m2[ 4 ] + m1[ 14 ] * m2[  8 ] + m1[ 15 ] * m2[ 12 ],
			m1[ 12 ] * m2[ 1 ] + m1[ 13 ] * m2[ 5 ] + m1[ 14 ] * m2[  9 ] + m1[ 15 ] * m2[ 13 ],
			m1[ 12 ] * m2[ 2 ] + m1[ 13 ] * m2[ 6 ] + m1[ 14 ] * m2[ 10 ] + m1[ 15 ] * m2[ 14 ],
			m1[ 12 ] * m2[ 3 ] + m1[ 13 ] * m2[ 7 ] + m1[ 14 ] * m2[ 11 ] + m1[ 15 ] * m2[ 15 ]
		];
	}
};
