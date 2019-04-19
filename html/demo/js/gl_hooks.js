/**
 *
 * this utility code assumes you have just one shader of the type
 * "x-shader/x-vertex" and "x-shader/x-fragment".
 *
 * it tries to parse out the names of the attributes and uniforms 
 * and do the webgl plumbing for you.
 *
 * the "gl" object returned has some utility functions for reduce
 * the amount of code need to do basic things.
 *
 * it uses jquery and glmatrix
 *
 * only tested under chrome and firefox
 *
 * val: need to check out http://glmatrix.net/
 *
 *
 */
var gl_hookz = function( selector ) {
	/* this is me being lazy */
	mat4 = glMatrix.mat4;


	if ( !selector ) selector = 'canvas';

	var canvas = $( selector )[ 0 ];
	if ( !canvas ) {
		console.log( 'could not find canvas for selector "' + selector + '"' );
		return;
	}

	var gl = canvas.getContext( "experimental-webgl" ) || canvas.getContext( "webgl" );
	if ( !gl ) { 
		console.log( 'could not create 3d context' );
		return;
	}

	if ( typeof WebGLDebugUtils !== 'undefined') {
		gl = WebGLDebugUtils.makeDebugContext( gl );
	}

	gl.enable( gl.DEPTH_TEST );
	gl.depthFunc( gl.LESS );
	gl.clearColor( 0, 0, 0, 1 );

	gl.hookz = {
		shader:{
			  attribute_names:[]
			, attributes:{}
			, uniform_names:[]
			, uniforms: {}
		}
		, textures:[]
		, faces:[]
		, util:{}
		, unused:{}
	};

	/*
		use the shaders to create the program that sets up how
		data will be shoveled into opengl and what to do with it
	*/

	var shaderProgram = gl.createProgram();

	/* assume we just have one of each type... */
	$( [ "fragment", "vertex" ] ).each( 
		function( i, v ) {
			var type = {fragment:gl.FRAGMENT_SHADER,vertex:gl.VERTEX_SHADER}[ v ];
			var shader = gl.createShader( type );
			var src = $( 'script[type="x-shader/x-' + v + '"]' ).text();

			console.log( 'processing ' + v );

			/* 
				this madness tries to pull out the names of attributes and 
				uniforms from the script .. it is kinda nuts
			*/

			var xrc = src
				.replace( /\/\/.*/g, '' )        /* remove eol comments */
				.replace( /\n/g, ' ' )           /* put everything on one line */
				.replace( /\/\*[^*]*\*\//g, '' ) /* not great way to remove block comments (can't have splats in the body!) */
				.replace( /;/g, ';\n' )          /* use semis to make new lines */
				.replace( /[\t ]+/g, ' ' )       /* normalize spacing */
				.replace( /;.*/g, '' )           /* trim from semi to eol */
			;
			/* console.log( xrc ); */
			xrc = xrc.split( '\n' )

			var pullNames = function( pattern, cb ) {
				var x = new RegExp( '^ *' + pattern + ' .*' );
				var cut = new RegExp( '^ *' + pattern + ' *[a-zA-Z_][a-zA-Z_0-9]* ' );
				for ( var i = 0 ; i < xrc.length ; i++ ) {
					if ( xrc[ i ].match( x ) ) {
						var attributes = xrc[ i ]
							.replace( cut, '' )
							.split( ',' )
						;
						console.log( '- ' + pattern + '>' + attributes );
						for ( var j = 0 ; j < attributes.length ; j++ ) {
							console.log( '- ' + pattern + '>>' + attributes[ j ] );
							cb( attributes[ j ] );
						}
					}
				}
			};
			pullNames( 'attribute', function( name ) { gl.hookz.shader.attribute_names.push( name ); } );
			pullNames( 'uniform', function( name ) { gl.hookz.shader.uniform_names.push( name ); } );

			gl.shaderSource( shader, src );
			gl.compileShader( shader );
			var compiled = gl.getShaderParameter( shader, gl.COMPILE_STATUS );
			if ( compiled ) {
				console.log( 'compiled ' + v );
				gl.attachShader( shaderProgram, shader );
			} else {
				console.log( v + ' failed to compile:' + gl.getShaderInfoLog( shader ) );
			}
		}
	);

	console.log( 'attributes:' + gl.hookz.shader.attribute_names.join( ',' ) );
	console.log( 'uniforms:' + gl.hookz.shader.uniform_names.join( ',' ) );

	gl.linkProgram( shaderProgram );
	if ( gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ) {
		console.log( 'linked shader program... hurray!' );
	} else {
		/* I dunno if this info log bit will work... */
		console.log( 'shader program failed to link...' );
		console.log( 'shader program failed to link: ' + gl.getShaderInfoLog( shaderProgram ) );
		return;
	}
	gl.useProgram( shaderProgram );

	gl.hookz.shader.program = shaderProgram;

	/* for all the attributes found in the shader program, hook them up */

	for ( var i = 0 ; i < gl.hookz.shader.attribute_names.length ; i++ ) {
		var name = gl.hookz.shader.attribute_names[ i ];
		var attribute = {
			  name:name
			, location:gl.getAttribLocation( shaderProgram, name )
		}
		if ( -1 == attribute.location ) {
			/* 
			   probably it was declared, but not used and was optimized out 
			   put it in the sh!t list...
			*/
			console.log( 'attribute.oops: "' + name + '"' );
			gl.hookz.unused[ name ] = true;
		} else {
			gl.hookz.shader.attributes[ name ] = attribute;
			gl.enableVertexAttribArray( attribute.location );
			console.log( 'attribute.ok: ' + name );
		}
	}

	
	/* for all the uniforms found in the shader program, hook them up */

	for ( var i = 0 ; i < gl.hookz.shader.uniform_names.length ; i++ ) {
		var name = gl.hookz.shader.uniform_names[ i ];
		var uniform = {
			name:name
			, location:gl.getUniformLocation( shaderProgram, name )
			, mat4:     mat4.identity( mat4.create() )
			, tmp_mat4: mat4.identity( mat4.create() )
		};

console.log( 'fck ' + name + ' and ' + uniform.tmp_mat4 );

		if ( -1 == uniform.location ) {
			console.log( 'uniform.oops: ' + name );
		} else {
			gl.hookz.shader.uniforms[ name ] = uniform;

			/* FIXME: this is a pain... need to know the type of the uniform */
			/* for now, just try a bunch bindings and hope something sticks...*/

			var uniform_type = false;
			
			console.log( 'trying to bind ' + name + ' some errors here are "ok"' );

			if ( !uniform_type ) {
				try { 
					gl.uniformMatrix4fv( uniform.location, false, uniform.mat4 ); 
					uniform_type = 'vec4';
				} catch( e ) {}
			}

			if ( !uniform_type ) {
				try { 
					gl.uniform1i( uniform.location, 0 ); 
					uniform_type = 'scalar';
				} catch( e ) {}
			}


			if ( !uniform_type ) {
				gl.hookz.unused[ name ] = true;
			}

			console.log( 'uniform.ok: ' + name + ', type:' + uniform_type );
		}
	}

	/* hookup some utility functions */

	gl.hookz.util.rotateNormalVectors = function( rotationMatrixName, normalMatrixName ) {
		var normalMatrix = mat3.create();
		mat4.toInverseMat3( gl.hookz.shader.uniforms[ rotationMatrixName ].mat4, normalMatrix);
		mat3.transpose( normalMatrix );
		gl.uniformMatrix3fv( gl.hookz.shader.uniforms[ normalMatrixName ].location, false, normalMatrix );
	};

	gl.hookz.util.mkBufferFromArray = function( a ) {
		var buffer = gl.createBuffer();
		buffer.raw = new Float32Array( a ); /* you can get ur good stuff here!!! */
		gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
		gl.bufferData( gl.ARRAY_BUFFER, buffer.raw, gl.STATIC_DRAW );
		return buffer;
	};

	gl.hookz.util.mkBuffer = function() {
		var a = [];
		for ( var i = 0 ; i < arguments.length ; i++ ) a.push( arguments[ i ] );
		return gl.hookz.util.mkBufferFromArray( a );
	};


	gl.hookz.util.bindBuffer = function( name, buffer, count, no_auto ) {
		if ( gl.hookz.unused[ name ] ) return false;
		
		var attribute = gl.hookz.shader.attributes[ name ];
		if ( !attribute ) {
			console.log( 'could not find attribute called ' + name );
			return;
		}
		/* remove old buffer if we used one before... careful now... */
		if ( no_auto && attribute.buffer ) {
			gl.glDeleteBuffer( attribute.buffer );
		}
		gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
		gl.vertexAttribPointer( attribute.location, count, gl.FLOAT, false, 0, 0 );
		attribute.buffer = buffer;
		return buffer;
	};

	gl.hookz.util.bufferData_ = function( name, count, junk ) {
		if ( junk[ 1 ] instanceof WebGLBuffer ) {
			var buffer = junk[ 1 ];
			return gl.hookz.util.bindBuffer( name, buffer, count, no_auto );
		} else {
			var args = [];         
			for ( var i = 1 ; i < junk.length ; i++ ) args.push( junk[ i ] );
			return gl.hookz.util.bindBuffer( name, gl.hookz.util.mkBufferFromArray( args ), count );
		}
	};

	/* x,y,z */
	gl.hookz.util.vertexData = function() {
		return gl.hookz.util.bufferData_( arguments[ 0 ], 3, arguments );
	};

	/* r,g,b,a */
	gl.hookz.util.colorData = function() {
		return gl.hookz.util.bufferData_( arguments[ 0 ], 4, arguments );
	};

	/* s,t */
	gl.hookz.util.textureData = function() {
		return gl.hookz.util.bufferData_( arguments[ 0 ], 2, arguments );
	};

	gl.hookz.util.getMatrix = function( name ) {
		return gl.hookz.shader.uniforms[ name ].mat4;
	};

	gl.hookz.util.updateMatrix = function( name ) {
		gl.uniformMatrix4fv( gl.hookz.shader.uniforms[ name ].location, false, gl.hookz.shader.uniforms[ name ].mat4 );
	};

	gl.hookz.util.uniform1f = function( name, a ) {
		gl.uniform1f( gl.hookz.shader.uniforms[ name ].location, a );
	};

	gl.hookz.util.uniform2f = function( name, a, b ) {
		gl.uniform2f( gl.hookz.shader.uniforms[ name ].location, a, b );
	};

	gl.hookz.util.uniform3f = function( name, a, b, c ) {
		gl.uniform3f( gl.hookz.shader.uniforms[ name ].location, a, b, c );
	};

	gl.hookz.util.uniform4f = function( name, a, b, c, d ) {
		gl.uniform4f( gl.hookz.shader.uniforms[ name ].location, a, b, c, d );
	};

	gl.hookz.util.identity = function( name ) {
		var uniform = gl.hookz.shader.uniforms[ name ];
		if ( uniform ) {
			mat4.identity( uniform.mat4 );
		}
	};

	gl.hookz.util.scale = function( name, scale ) {
		var uniform = gl.hookz.shader.uniforms[ name ];
		if ( uniform ) {
			mat4.copy( uniform.tmp_mat4, uniform.mat4 );
			mat4.scale( uniform.mat4, uniform.tmp_mat4, [scale,scale,scale] );
		}
	}

	gl.hookz.util.rotate = function( name, angle, axis ) {
		var uniform = gl.hookz.shader.uniforms[ name ];
		if ( uniform ) {
			// valerie: verifiy this is fixed now
			mat4.copy( uniform.tmp_mat4, uniform.mat4 );
			mat4.rotate( uniform.mat4, uniform.tmp_mat4, angle, axis );
		}
	};

	gl.hookz.util.rotateX = function( name, angle ) {
		var uniform = gl.hookz.shader.uniforms[ name ];
		if ( uniform ) {
			mat4.copy( uniform.tmp_mat4, uniform.mat4 );
			mat4.rotateX( uniform.mat4, uniform.tmp_mat4, angle );
		}
	};

	gl.hookz.util.rotateY = function( name, angle ) {
		var uniform = gl.hookz.shader.uniforms[ name ];
		if ( uniform ) {
			mat4.copy( uniform.tmp_mat4, uniform.mat4 );
			mat4.rotateY( uniform.mat4, uniform.tmp_mat4, angle );
		}
	};

	gl.hookz.util.rotateZ = function( name, angle ) {
		var uniform = gl.hookz.shader.uniforms[ name ];
		if ( uniform ) {
			mat4.copy( uniform.tmp_mat4, uniform.mat4 );
			mat4.rotateZ( uniform.mat4, uniform.tmp_mat4, angle ); 
		}
	};

	gl.hookz.util.translate = function( name, values ) {
		var uniform = gl.hookz.shader.uniforms[ name ];
		if ( uniform ) {
			mat4.copy( uniform.tmp_mat4, uniform.mat4 );
			mat4.translate( uniform.mat4, uniform.tmp_mat4, values );
		}
	};

	gl.hookz.util.translateX = function( name, value ) {
		gl.hookz.util.translate( name, [ value, 0, 0 ] );
	};

	gl.hookz.util.translateY = function( name, value ) {
		gl.hookz.util.translate( name, [ 0, value, 0 ] );
	};

	gl.hookz.util.translateZ = function( name, value ) {
		gl.hookz.util.translate( name, [ 0, 0, value ] );
	};


	/* texture junk */

	gl.hookz.util.texture = function( image_url ) {
		var texture = gl.createTexture();
		texture.image = new Image();
		texture.ready = false;
		texture.image.onload = function() {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.bindTexture(gl.TEXTURE_2D, null);

			texture.ready = true;
			gl.hookz.textures[ image_url ] = texture;
		}
		texture.image.src = image_url;
	};

	gl.hookz.util.useTexture = function( image_url, which ) {
		var texture = gl.hookz.textures[ image_url ];
		if ( texture ) {
			gl.activeTexture( which || gl.TEXTURE0 );
			gl.bindTexture(gl.TEXTURE_2D, texture);
			/*
				the examples I used had some junk like:

				gl.uniform1i( gl.hookz.shader.uniforms[ 'uSampler' ].location, 0 );

				but it doesn't seem to be used so I left it out..
				if it's needed, add it to the gl.hookz.util.texture
				hang it off the texture object and use it here...
			*/
		}
	};

	gl.hookz.util.facesData = function() {
		var name = arguments[ 0 ];
		var args = [];                 
		for ( var i = 1 ; i < arguments.length ; i++ ) args.push( arguments[ i ] );
		var buffer = gl.createBuffer();
		buffer.raw = new Uint16Array( args );
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, buffer );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, buffer.raw, gl.STATIC_DRAW );
		gl.hookz.faces[ name ] = buffer;
		return buffer;
	};

	gl.hookz.util.useFaceData = function( name ) {
		var buffer = gl.hookz.faces[ name ];
		if ( buffer ) { 
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, buffer );
		}
	};

	gl.hookz.util.cross = function( x0, y0, z0, x1, y1, z1, x2, y2, z2 ) {
		var v1 = [ x0 - x1, y0 - y1, z0 - z1 ];
		var v2 = [ x2 - x1, y2 - y1, z2 - z1 ];
		
		console.log( v1.join( "," ) );
		console.log( v2.join( "," ) );

		var vz = [ v1, v2 ];
		for ( var i = 0 ; i < vz.length ; i++ ) {
			var l = 0;
			for ( var j = 0 ; j < vz[ i ].length ; j++ ) {
				l += vz[ i ][ j ] * vz[ i ][ j ];
			}
			if ( 0 != l ) {
				l = Math.sqrt( l );
				for ( var j = 0 ; j < vz[ i ].length ; j++ ) {
					vz[ i ][ j ] /= l;
				}
			}
		}

		console.log( v1.join( "," ) );
		console.log( v2.join( "," ) );

		/* x,yzzy -> 0,1221 */
		return [
			  v1[ 1 ] * v2[ 2 ] - v1[ 2 ] * v2[ 1 ] 
			, v1[ 2 ] * v2[ 0 ] - v1[ 0 ] * v2[ 2 ] 
			, v1[ 0 ] * v2[ 1 ] - v1[ 1 ] * v2[ 0 ] 
		];
	};

	gl.hookz.util.argo = function( name, arr ) {
		var args = [ name ];
		return args.push.apply( args, arr );
	};

	/* cube maps */

	gl.hookz.util.makeCubeMap = function( faces ) {
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		for ( var face in faces ) {
			var image = new Image();
			image.onload = function(texture, face, image) {
				return function() {
					gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
					gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
					gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
				}
			} (texture, face, image);
			image.src = faces[ face ];
		}
		return texture;
	};

	gl.hookz.util.containsWhich = function( input, values ) {
		var which = -1;
		for ( var j = 0 ; j < values.length ; j++ ) {
			if ( -1 != input.indexOf( values[ j ] ) ) {
				if ( -1 != which ) {
					which = -1;
					break;
				} else {
					which = j;
				}
			}
		}
		return which;
	};

	/**
	 *
	 * only works if you have "pos" and "x", "y", and "z" in 
	 * the filename only to indicate face! stuff like "fuz-negx.jpg"
	 * are problematic!
	 *
	 */ 
	gl.hookz.util.mapCubeByFilename = function( urls ) {
		var faces = {};

		var gl_values = [
			  gl.TEXTURE_CUBE_MAP_NEGATIVE_X
			, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y
			, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
			, gl.TEXTURE_CUBE_MAP_POSITIVE_X
			, gl.TEXTURE_CUBE_MAP_POSITIVE_Y
			, gl.TEXTURE_CUBE_MAP_POSITIVE_Z
		];

		for ( var i = 0 ; i < urls.length ; i++ ) {
			var url = urls[ i ];
			var filename = url.replace( /.*\//, '' ).toLowerCase();

			var dir_ = gl.hookz.util.containsWhich( filename, [ 'neg', 'pos' ] );
			if ( -1 == dir_ ) {
				console.log( 'bad filename direction ' + filename );
				return;
			}
			var axis_ = gl.hookz.util.containsWhich( filename, [ 'x', 'y', 'z' ] );
			if ( -1 == axis_ ) {
				console.log( 'bad filename axis ' + filename );
				return;
			}
			faces[ gl_values[ dir_ * 3 + axis_ ] ] = url;
		}

		return faces;
	};

	gl.hookz.util.loadCubeMap = function() {
		return gl.hookz.util.makeCubeMap(
			gl.hookz.util.mapCubeByFilename( arguments )
		);
	};

	/* ... */

	gl.hookz.util.calculateNormal = function( x0,y0,z0, x1,y1,z1, x2,y2,z2 ) {
		var pt0 = vec3.create( [ x0,y0,z0 ] );
		var pt1 = vec3.create( [ x1,y1,z1 ] );
		var pt2 = vec3.create( [ x2,y2,z2 ] );

		vec3.subtract( pt0, pt1 );
		vec3.subtract( pt2, pt1 );
		vec3.normalize( pt0 );
		vec3.normalize( pt2 );
		vec3.cross( pt0, pt2, pt1 );
		return pt1;
	};

	/* TODO: error handling */
	gl.hookz.util.newThing = function( thang ) {
		this.init = function( thang ) {
			this.thang = thang;
			if ( thang.texture ) {
				this.texture = gl.hookz.util.texture( thang.texture );
			}
			if ( this.thang.faces ) {
				this.initFacesVersion( thang );
			} else {
				this.initNeheVersion( thang );
			}
		};

		this.initFacesVersion = function( thang ) {
			var ps = [];
			var cs = [];
			var ts = [];
			var ns = [];
			var faces = [];
			var face_index = 0;
			for ( var i = 0 ; i < thang.faces.length ; i++ ) {
				var thangFace = thang.faces[ i ];

				for ( var j = 0 ; j < thangFace.length ; j++ ) {
					var thangVertex = thangFace[ j ];
					ps.push.apply( ps, thangVertex.p );
					ns.push.apply( ns, thangVertex.n );

					/* default some lame texture coordinates */
					if ( !thangVertex.t ) {
						thangVertex.t = [ 0, 0 ];
					}
					ts.push.apply( ts, thangVertex.t );

					/* default to white */
					if ( !thangVertex.c ) {
						thangVertex.c = [ 1,1,1,1 ]; 
					}
					cs.push.apply( cs, thangVertex.c );

					faces.push( face_index++ );
				}
			}

			/* let the faces passed in override the generated faces: */
			if ( thang.index ) {
				faces = thang.index;
			}

			this.initCommon( faces, ps, cs, ts, ns );
		};

		this.initNeheVersion = function( thang ) {
			this.initCommon(
				  thang.indices
				, thang.vertexPositions
				, thang.vertexColors
				, thang.vertexTextureCoords
				, thang.vertexNormals
			);
		};

		this.initCommon = function( faces, ps, cs, ts, ns ) {
			if ( !cs ) {
				cs = [];
				for ( var i = 0 ; i < ps.length / 3 ; i++ ) {
					cs.push.apply( cs, [1,1,1,1] );
				}
			}

			if ( !ns || 0 == ns.length ) {
				ns = this.calculateNormals( faces, ps );
			}

			if ( !ts ) {
				ts = ps; /* haha! */
			}

			console.log( faces.length + ' and ' + [ps.length, cs.length, ts.length, ns.length].join( ',' ) );

			/* create the faces */
			this.gl_faces = gl.createBuffer();
			this.gl_faces.raw = new Uint16Array( faces );
			this.count = faces.length;

			var values = [ ps, cs, ts, ns ];
			var sizes = [ 3, 4, 2, 3 ];
			this.values = [];
			for ( var i = 0 ; i < values.length ; i++ ) {
				var value = values[ i ];
				var buffer = gl.createBuffer();
				buffer.raw = new Float32Array( value );
				buffer.size = sizes[ i ];
				gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
				gl.bufferData( gl.ARRAY_BUFFER, buffer.raw, gl.STATIC_DRAW );
				this.values.push( buffer );
			}
		};

		this.calculateNormals = function( faces, ps ) {
			var ns_vec3 = [];
			for ( var i = 0 ; i < ps.length ; i += 3 ) {
				ns_vec3.push( vec3.create() );
			}

			/* FIXME: assumes triangles... */
			for ( var i = 0 ; i < faces.length ; i += 3 ) {
				var pt0_idx = 3 * faces[ i + 0 ];
				var pt1_idx = 3 * faces[ i + 1 ];
				var pt2_idx = 3 * faces[ i + 2 ];

				var normal = gl.hookz.util.calculateNormal( 
					  ps[ pt0_idx + 0 ], ps[ pt0_idx + 1 ], ps[ pt0_idx + 2 ]
					, ps[ pt1_idx + 0 ], ps[ pt1_idx + 1 ], ps[ pt1_idx + 2 ]
					, ps[ pt2_idx + 0 ], ps[ pt2_idx + 1 ], ps[ pt2_idx + 2 ]
				);

				/* accumulate for each vertex associated with the face */
				vec3.add( ns_vec3[ faces[ i + 0 ] ], normal );
				vec3.add( ns_vec3[ faces[ i + 1 ] ], normal );
				vec3.add( ns_vec3[ faces[ i + 1 ] ], normal );
			}

			var ns = [];
			for ( var i = 0 ; i < ns_vec3.length ; i++ ) {
				var normal = ns_vec3[ i ];
				vec3.normalize( normal );
				ns.push.apply( ns, normal );
			}

			return ns;
		};

		this.draw = function() {
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.gl_faces );
			gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, this.gl_faces.raw, gl.STATIC_DRAW );

			if ( this.thang.texture ) {
				gl.hookz.util.useTexture( this.thang.texture );
			}

			/* this is gross... */
			var attributeNames = "aVertexPosition aVertexColor aTextureCoord aVertexNormal".split( " " );

			for ( var i = 0 ; i < this.values.length ; i++ ) {
				var value = this.values[ i ];
				var buffer = value;
									
				var name = attributeNames[ i ];	
				if ( gl.hookz.unused[ name ] ) {
					continue;
				}

				var attribute = gl.hookz.shader.attributes[ name ];
				if ( !attribute ) {
					console.log( 'could not find attribute named ' + attributeNames[ i ] );
					continue;
				}

				gl.bindBuffer( gl.ARRAY_BUFFER, value );
				gl.vertexAttribPointer( attribute.location, value.size, gl.FLOAT, false, 0, 0 );
			}

			/* assume triangle... */
			gl.drawElements( gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0 );
		};
		this.init( thang );
	};

	return gl;
};
