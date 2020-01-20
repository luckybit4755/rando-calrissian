const Glo = {
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
		Glo.shader( gl, program, vertexSource, gl.VERTEX_SHADER );
		Glo.shader( gl, program, fragmentSource, gl.FRAGMENT_SHADER );

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
		Glo.draw( gl, faces );
	}
	, demo: function() {
		let canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
		let gl = Glo.gl( canvas );

		let program = Glo.program( gl, Shaders.simple.vertex, Shaders.simple.fragment );

		Glo.data( gl, program, 'aPosition', [
			  -1, -1, 0
			,  0,  1, 0
			, +1, -1, 0
		]);

		Glo.data( gl, program, 'aColor', [
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

			Glo.matrix( gl, program, 'uMatrix', m );

			Glo.clear( gl );
			Glo.triangles( gl, [ 0, 1, 2 ] );

			setTimeout( function() { requestAnimationFrame( draw ) }, 50 );
		}

		draw();
	},
};
