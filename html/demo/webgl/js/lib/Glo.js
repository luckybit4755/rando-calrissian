import Matrixo from './Matrixo.js';
import Mouseo  from './Mouseo.js';
import Utilo   from './Utilo.js';

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
		floatsPerValue = Utilo.idk( floatsPerValue, 3 );

		// try to cut down on buffer creation
		//let buffer = Glo._buffer( gl, data );
		let buffer = Glo._bufferN( gl, name );

		data = new Float32Array( data ); 

		gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
		gl.bufferData( gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW );
		//gl.bufferData( gl.ARRAY_BUFFER, data, gl.STATIC_DRAW );

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
		what = Utilo.idk( what, gl.TRIANGLES );
		if ( faces ) {
			let buffer = Glo._bufferN( gl, '_faces' );
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, buffer );
			gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( faces ), gl.DYNAMIC_DRAW );
			//gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( faces ), gl.STATIC_DRAW );
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
		gl.bindTexture( gl.TEXTURE_2D, image.glo_texture );
		gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
		gl.bindTexture( gl.TEXTURE_2D, null );
	}
	, texture: function( gl, program, name, image, gl_texture_id ) {
		if ( !( 'glo_texture' in image ) ) throw 'need to call textureSetup for image first';
		gl_texture_id = Utilo.idk( gl_texture_id, gl.TEXTURE0 );
		let samplerValue = gl_texture_id - gl.TEXTURE0;
		gl.activeTexture( gl_texture_id );
		gl.bindTexture( gl.TEXTURE_2D, image.glo_texture );
		Glo.value( gl, program, name, samplerValue );
	}
	, cubemapSetup: function( gl ) {
		let texture = gl.createTexture();

		gl.bindTexture( gl.TEXTURE_CUBE_MAP, texture );
		gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
		
		return texture;
	}
	, cubemapImage: function( gl, program, name, texture, image, gl_cube_map_face_id ) {
		gl.bindTexture( gl.TEXTURE_CUBE_MAP, texture );
		gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, false );

		gl.texImage2D( gl_cube_map_face_id, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
	}
	, cubemap: function( gl, program, name, images ) {
		let texture = Glo.cubemapSetup( gl );
		for ( let i = 0 ; i < images.length ; i++ ) {
			let image = images[ i ];
			let face = Glo.cubefaceByIndex( gl, i );
			Glo.cubemapImage( gl, program, name, texture, image, face );
		}

		let shader_uCubeSampler = gl.getUniformLocation( program, name );
		gl.uniform1i( shader_uCubeSampler, 0 ); // 0???
		return texture;
    }   

	, cubefaceByIndex: function( gl, index ) {
		return Object.values( Glo.cubemapIndices( gl ) )[ index ];
	}
	, cubefaceByName: function( gl, name ) {
		return Glo.cubemapIndices( gl )[ name ];
	}
	, cubemapIndices: function( gl ) {
		return {
			posx: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
			negx: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
			posy: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
			negy: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
			posz: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
			negz: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
		};
	}
	, drawMesh: function( gl, program, mesh ) {
		let type = ( 'type' in mesh ) ? mesh.type : gl.TRIANGLES;

		if ( !( 'attributes' in mesh ) ) {
			throw 'missing "attributes" value in mesh object';
		}

		for ( let name in mesh.attributes ) {
			let data = mesh.attributes[ name ];
			Glo.data( gl, program, name, data );
		}

		Glo.draw( gl, mesh.faces, type );
	}
	, demoSetup: function( shaders, matrixName, flags ) {
		matrixName = Utilo.idk( matrixName, 'uMatrix' );
		flags = Utilo.idk( flags, {} );

		let canvas = Utilo.getByTag( 'canvas' );

    	Utilo.getByContents( 'fullscreen' ).onclick = function() { Utilo.fullscreen( canvas ); };
    	let mouseControls = Mouseo.simpleControls( canvas );

    	let gl = Glo.gl( canvas, flags );
    	let program = Glo.program( gl, shaders.vertex, shaders.fragment );

		let setup = { canvas: canvas, gl:gl, program:program, mouseControls:mouseControls };

		setup.mouseLoop = function( matrix ) {
			Glo.clear( gl );

			matrix = Utilo.idk( matrix, Matrixo.scale( 0.55 ) );

			mouseControls.idle( 5000, 0.03 );

        	let m = Matrixo.multiply( setup.mouseControls.matrix(), matrix );
        	Glo.matrix( gl, program, matrixName, m );
		}

		return setup;
	}
};

export default Glo;
