const Glo = {
	gl: function( canvas, flags ) {
		let gl = canvas.getContext( 'webgl', flags );
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
	_buffer: function( gl, data ) {
		let need = true;
		if ( 'glod' in data ) {
			if ( data.length == data.glod.length ) {
				need = false;
			} else {
				console.log( 'deleteBuffer' );
				gl.deleteBuffer( data.glod.buffer  );
			}
		} 

		if ( need ) {
			console.log( 'createBuffer' );
			data.glod = { length:data.length, buffer:gl.createBuffer() }
		}
		return data.glod.buffer;
	},
	_bufferN: function( gl, name ) {
		if ( !( 'glo' in gl ) ) gl.glo = {buffers:{}};
		return (
			( name in gl.glo.buffers )
			? ( gl.glo.buffers[ name ] )
			: ( gl.glo.buffers[ name ] = gl.createBuffer() )
		)
	},
	data: function( gl, program, name, data, floatsPerValue ) {
		if ( 'undefined' === typeof( floatsPerValue ) ) { floatsPerValue = 3; }

		// try to cut down on buffer creation
		//let buffer = Glo._buffer( gl, data );
		let buffer = Glo._bufferN( gl, name );

		data = new Float32Array( data ); 

		gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
		gl.bufferData( gl.ARRAY_BUFFER, data, gl.STATIC_DRAW );

		let location = gl.getAttribLocation( program, name );
		gl.enableVertexAttribArray( location );
		gl.vertexAttribPointer( location, floatsPerValue, gl.FLOAT, false, 0, 0 );
	},
	matrix: function( gl, program, name, data ) {
		data = new Float32Array( data );
		let location = gl.getUniformLocation( program, name );
		gl.uniformMatrix4fv( location, false, data );
	},
	value: function( gl, program, name, value ) {
		let location = gl.getUniformLocation( program, name );
		// swag on gl.uniform1i is bad...
		gl.uniform1i( location, value );
	},
	clear: function( gl ) {
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	},
	draw: function( gl, faces, what ) {
		if ( 'undefined' === typeof( what ) ) {
			what = gl.TRIANGLES;
		}
		if ( faces ) {
			let buffer = Glo._bufferN( gl, '_faces' );
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, buffer );
			gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( faces ), gl.STATIC_DRAW );
			gl.drawElements( what, faces.length , gl.UNSIGNED_SHORT, 0 );
		} else {
			gl.drawArrays( what, 0,  3);
		}
	},
	triangles: function( gl, faces ) {
		Glo.draw( gl, faces );
	}
	, textureSetup: function( gl, program, image ) {
		if ( !image.glo_texture ) {
			image.glo_texture = gl.createTexture();
		}
		gl.useProgram( program );
		gl.bindTexture( gl.TEXTURE_2D, image.glo_texture );
		gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
		gl.bindTexture( gl.TEXTURE_2D, null );
	}
	, texture: function( gl, program, name, image, gl_texture_id ) {
		if ( !( 'glo_texture' in image ) ) throw 'need to call textureSetup for image first';
		if ( 'undefined' === typeof( gl_texture_id ) ) {
			gl_texture_id = gl.TEXTURE0;
		}
		let samplerValue = gl_texture_id - gl.TEXTURE0;
		gl.activeTexture( gl_texture_id );
		gl.bindTexture( gl.TEXTURE_2D, image.glo_texture );
		Glo.value( gl, program, name, samplerValue );
	}
};
