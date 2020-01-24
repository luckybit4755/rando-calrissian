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
		const z = -s;
		return [
			1, 0, 0, 0,
			0, c, z, 0,
			0, s, c, 0,
			0, 0, 0, 1
		];
	},
	rotateY: function( c, s ) {
		const z = -s;
		return [
			c, 0, s, 0,
			0, 1, 0, 0,
			z, 0, c, 0,
			0, 0, 0, 1
		];
	},
	rotateZ: function( c, s ) {
		const z = -s;
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
		y = Utilo.idk( y, x );
		z = Utilo.idk( z, x );
        return [
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1
        ]
    },
	multiply: function( m1, m2 ) {
		return Matrixo.gossipMultiply( m1, m2 );
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
	}
	, fastMultiply: function( m1, m2 ) {
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
	, gossipMultiply: function( a, b ) {
		// from https://openhome.cc/Gossip/WebGL/samples/Quaternion-1.html
		// it avoids a number of repeated multiplications
		const a00 = a[0 * 4 + 0];
		const a01 = a[0 * 4 + 1];
		const a02 = a[0 * 4 + 2];
		const a03 = a[0 * 4 + 3];

		const a10 = a[1 * 4 + 0];
		const a11 = a[1 * 4 + 1];
		const a12 = a[1 * 4 + 2];
		const a13 = a[1 * 4 + 3];

		const a20 = a[2 * 4 + 0];
		const a21 = a[2 * 4 + 1];
		const a22 = a[2 * 4 + 2];
		const a23 = a[2 * 4 + 3];

		const a30 = a[3 * 4 + 0];
		const a31 = a[3 * 4 + 1];
		const a32 = a[3 * 4 + 2];
		const a33 = a[3 * 4 + 3];

		const b00 = b[0 * 4 + 0];
		const b01 = b[0 * 4 + 1];
		const b02 = b[0 * 4 + 2];
		const b03 = b[0 * 4 + 3];

		const b10 = b[1 * 4 + 0];
		const b11 = b[1 * 4 + 1];
		const b12 = b[1 * 4 + 2];
		const b13 = b[1 * 4 + 3];

		const b20 = b[2 * 4 + 0];
		const b21 = b[2 * 4 + 1];
		const b22 = b[2 * 4 + 2];
		const b23 = b[2 * 4 + 3];

		const b30 = b[3 * 4 + 0];
		const b31 = b[3 * 4 + 1];
		const b32 = b[3 * 4 + 2];
		const b33 = b[3 * 4 + 3];
		return [
			b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
			b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
			b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
			b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,

			b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
			b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
			b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
			b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,

			b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
			b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
			b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
			b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,

			b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
			b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
			b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
			b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
		];
	}
	, multiplyMatrices: function() {
		let m = arguments[ 0 ];
		for ( let i = 1 ; i < arguments.length ; i++ ) {
			m = Matrixo.multiply( m, arguments[ i ] );
		}
		return m;
	}
	, lookAt: function() {
		//https://gamedev.stackexchange.com/questions/133867/whats-wrong-with-this-camera-implementation/134124
/*
   var r = this.right,
        u = this.up,
        f = this.front,
        p = this.position;

    var view = [r[0], u[0], -f[0], 0.0,
                r[1], u[1], -f[1], 0.0,
                r[2], u[2], -f[2], 0.0,
                0.0,  0.0,  0.0,  1.0]
    var a = [1.0, 0.0, 0.0, 0.0,
             0.0, 1.0, 0.0, 0.0,
             0.0, 0.0, 1.0, 0.0,
             -p[0], -p[1], -p[2], 1.0];

    mat4.multiply(view, view, a);
*/
	}
};
