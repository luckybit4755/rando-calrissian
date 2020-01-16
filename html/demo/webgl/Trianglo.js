const Trianglo = {
	gl: function( canvas ) {
		let gl = canvas.getContext( 'webgl' );
		if ( !gl ) throw 'could not get webgl context';
		gl.enable( gl.DEPTH_TEST );
		gl.depthFunc( gl.LESS );
		gl.clearColor( 0, 0, 0, 1 );
		return gl;
	},
	program: function( gl, vertexSource, fragmentSource ) {
		let program = gl.createProgram();
		Trianglo.shader( gl, program, vertexSource, gl.VERTEX_SHADER );
		Trianglo.shader( gl, program, fragmentSource, gl.FRAGMENT_SHADER );

		gl.linkProgram( program );
		if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
			throw gl.getProgramInfoLog( program );
		}
		gl.useProgram( program );
		return program;
	},
	shader: function( gl, program, source, type ) {
		let shader = gl.createShader( type );
		gl.shaderSource( shader, source );
		gl.compileShader( shader );
		if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
			throw gl.getShaderInfoLog( shader );
		}
		gl.attachShader( program, shader );
		return shader;
	},
	data: function( gl, program, name, data, floatsPerValue ) {
		if ( 'undefined' === typeof( floatsPerValue ) ) { floatsPerValue = 3; }

		data = new Float32Array( data );
		let location = gl.getAttribLocation( program, name );
		gl.bindBuffer( gl.ARRAY_BUFFER, gl.createBuffer() );
		gl.bufferData( gl.ARRAY_BUFFER, data, gl.STATIC_DRAW );
		gl.enableVertexAttribArray( location );
		gl.vertexAttribPointer( location, floatsPerValue, gl.FLOAT, false, 0, 0 );
	},
	matrix: function( gl, program, name, data ) {
		data = new Float32Array( data );
		let location = gl.getUniformLocation( program, name );
		gl.uniformMatrix4fv( location, false, data );
	},
	clear: function( gl ) {
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	},
	draw: function( gl, faces, what ) {
		if ( 'undefined' === typeof( what ) ) {
			what = gl.TRIANGLES;
		}
		if ( faces ) {
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer() );
			gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( faces ), gl.STATIC_DRAW );
			gl.drawElements( what, faces.length , gl.UNSIGNED_SHORT, 0 );
		} else {
			gl.drawArrays( what, 0,  3);
		}
	},
	triangles: function( gl, faces ) {
		Trianglo.draw( gl, faces );
	}
	, demo: function() {
		let canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
		let vertexSource = document.getElementById( 'vertex-shader' ).innerHTML;
		let fragmentSource = document.getElementById( 'fragment-shader' ).innerHTML;

		let gl = Trianglo.gl( canvas );
	
		let program = Trianglo.program( gl, vertexSource, fragmentSource );

		Trianglo.data( gl, program, 'aPosition', [
			  -1, -1, 0
			,  0,  1, 0
			, +1, -1, 0
		]);

		Trianglo.data( gl, program, 'aColor', [
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0
		]);

		let angle = 0;

		let draw = function() {
			angle += 0.033;
			let c = Math.cos( angle );
			let s = Math.sin( angle );

			let x = Matrixo.rotateX( c, s );
			let y = Matrixo.rotateY( c, s );
			let z = Matrixo.rotateZ( c, s );
			let q = Matrixo.scale( 0.66 );

			let m = Matrixo.multiply( Matrixo.multiply( Matrixo.multiply( x, y ), z ), q );

			Trianglo.matrix( gl, program, 'uMatrix', m );

			Trianglo.clear( gl );
			Trianglo.triangles( gl, [ 0, 1, 2 ] );

			setTimeout( function() { requestAnimationFrame( draw ) }, 50 );
		}

		draw();
	},
};

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
		return Math.sqrt( Vectoro.dot( v, v ) );
	}
	, dot: function( v, u ) {
		return ( v[ 0 ] * u[ 0 ] + v[ 1 ] * u[ 1 ] + v[ 2 ] * u[ 2 ] );
	}
	, cross: function( v, u ) {
        return [
			  v[ 1 ]*u[ 2 ] - v[ 2 ]*u[ 1 ] // x = v.y * u.z - v.z - u.y <-- xyzzy
			, v[ 2 ]*u[ 0 ] - v[ 0 ]*u[ 2 ] // y =v.z * u.x - v.x - u.z
			, v[ 0 ]*u[ 1 ] - v[ 1 ]*u[ 0 ] // zv.x * u.y - v.y - u.x
        ];
	}
	, subtract: function( v, u ) {
		return [ v[ 0 ] - u[ 0 ], v[ 1 ] - u[ 1 ], v[ 2 ] - u[ 2 ] ];
	}
	, normalVector: function( v0, v1, v2 ) {
		return Vectoro.cross( Vectoro.subtract( v0, v1 ), Vectoro.subtract( v2, v1 ) );
	}
	, add: function( v, u ) {
		return [ v[ 0 ] + u[ 0 ], v[ 1 ] + u[ 1 ], v[ 2 ] + u[ 2 ] ];
	}
	, toString: function( v, precision ) {
		if ( 'undefined' === typeof( precision ) ) {
			precision = 1000;
		}
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
