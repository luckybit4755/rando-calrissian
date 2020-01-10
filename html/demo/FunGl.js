const FunGL = function(canvas, vertexShaderSource, fragmentShaderSource) {
	this.init(canvas, vertexShaderSource, fragmentShaderSource);
};

FunGL.prototype = {
	init: function(canvas, vertexShaderSource, fragmentShaderSource) {
		if (!canvas) return;

		this.canvas = canvas;
		this.vertexShaderSource = vertexShaderSource;
		this.fragmentShaderSource = fragmentShaderSource;

		let gl = (this.gl = canvas.getContext("webgl"));
		if (!gl) {
			throw "Could not get webgl context";
		}

		let glDebug = tuue;
		if ( glDebug ) {
			this.gl_symbol_lookup = {};
			for ( let k in gl ) {
				let v = gl[ k ];
				if ( 'function' === typeof( v ) ) {
					gl[ k ] = this.logFunctionCall( k, gl[ k ] );
				} else {
					this.gl_symbol_lookup[ v ] = 'gl.' + k;
				}
			}
		}


		//this.basicSetup(gl);
		this.program = this.createProgram(
			gl,
			vertexShaderSource,
			fragmentShaderSource
		);
		gl.useProgram(this.program);

		this.variables = this.linkVariables(
			gl,
			this.program,
			vertexShaderSource,
			fragmentShaderSource
		);

		this.names = {};
		for (let type in this.variables) {
			for (let name in this.variables[type]) {
				this.names[name] = name;
			}
		}
	},
	prettyValue: function( v ) {
		let a = v;
		switch( Array.isArray( v ) || typeof( v ) ) {
			case true:
				a = '[' + v.join( ', ') + ']'; 
				break;
			case 'object': 
				let tmp = false;
				if ( 'toString' in v ) {
					v = v.toString().replace( /^\[object /, '' ).replace( /]/, '');
					a = 'object:{' + v + '}';
				} else {
					a = JSON.stringify( v ); 
					if ( '{}' === a ) a = v;
				}
				break;
			case 'string': 
				a = '"' + v.replace( /\n+/g,  '\\n' ).replace( /\s+/, ' ' ) + '"'; 
				break;
			default:
				// this is pretty bonkers...
				if ( v == parseInt( v ) ) {
					let looked = false;
					if ( 'lookup' in this.logFunctionCall && v in this.logFunctionCall.lookup ) {
						a = this.logFunctionCall.lookup[ v ];
					}  else {
						if ( v in this.gl_symbol_lookup ) {
							a = this.gl_symbol_lookup[ v ] + ':' + v;
						}
					}
				}
		}

		return a;
	},
	logFunctionCall: function( name, originalFunction ) {
		let thiz = this;
		return function() {
			let argz = '';
			if ( arguments.length ) {
				for ( let k in arguments ) {
					argz += ( argz.length ? ', ' : ' ' ) + thiz.prettyValue( arguments[ k ] );
				}
				argz += ' ';
			}
			let message = 'gl.' + name + '(' + argz + ')';
			let result = false;

			try {
				result = originalFunction.apply( this, arguments );

				if ( result === parseInt( result ) ) {
					/* you have to love the madness that comes with everything being an object */
					if ( !( 'lookup' in thiz.logFunctionCall ) ) {
						thiz.logFunctionCall.lookup = {};
					}
					thiz.logFunctionCall[ result ] = message;
				}

				if ( 'undefined' !== result && 'undefined' != ( '' + result ) ) {
					message += ' -> ' + thiz.prettyValue( result );
				}
			} catch( e ){
				message += ' ERROR: ' + e;
			}

			thiz.log( message );
			return result;
		};
	},
	basicSetup: function(gl) {
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);
		gl.clearColor(0, 0, 0, 1);
	},
	createProgram: function(gl, vertexShaderSource, fragmentShaderSource) {
		let program = gl.createProgram();
		
		let shaderSource = {};
		shaderSource[ gl.VERTEX_SHADER ] = vertexShaderSource;
		shaderSource[ gl.FRAGMENT_SHADER ] = fragmentShaderSource;

		for( let type in shaderSource ) {
			type = parseInt( type ); // val: magical type conversion is magical
			let source = shaderSource[ type ];
			gl.attachShader( program, this.createShader(gl, source, type ) );
		}

		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw "Could not link program! " + gl.getProgramInfoLog(program);
		}

		return program;
	},
	createShader: function(gl, shaderSource, type) {
		let shader = gl.createShader(type);
		gl.shaderSource(shader, shaderSource);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			throw gl.getShaderInfoLog(shader);
		}
		return shader;
	},
	parseVariables: function(shaderSource) {
		let blockComment = 0;
		while (-1 != (blockComment = shaderSource.indexOf("/*"))) {
			let endComment = shaderSource.indexOf("*/", blockComment);
			if (-1 == endComment) {
				throw "Unterminated block comment in shader source";
			}
			shaderSource =
				shaderSource.substr(0, blockComment) +
				"\n" +
				shaderSource.substr(endComment + 2);
		}

		let lines = shaderSource
			.replace(/\/\/.*/g, "") /* remove eol comments */
			.replace(/\n/g, " ") /* put everything on one line */
			.replace(/[;{}]/g, ";\n") /* use semis to make new lines */
			.replace(/[\t ]+/g, " ") /* normalize spacing */
			.replace(/;.*/g, "") /* trim from semi to eol */
			.split("\n");

		let variables = { attribute: [], uniform: [] };
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i].trim();
			for (let key in variables) {
				if (0 == line.indexOf(key)) {
					variables[key].push(line.replace(/.*\s/, ""));
				}
			}
		}
		return variables;
	},
	linkVariables: function(
		gl,
		program,
		vertexShaderSource,
		fragmentShaderSource
	) {
		let variables = this.parseVariables(
			vertexShaderSource + "\n" + fragmentShaderSource
		);
		return {
			attributes: this.linkAttributes(gl, program, variables.attribute),
			uniforms: this.linkUniforms(gl, program, variables.uniform)
		};
	},
	linkAttributes: function(gl, program, names) {
		let attributes = {};
		for (let i = 0; i < names.length; i++) {
			let name = names[i];
			let location = gl.getAttribLocation(program, name);
			if (-1 == location) {
				/* TODO: log or warn? */
			} else {
				gl.enableVertexAttribArray(location);
				attributes[name] = location;
			}
		}
		return attributes;
	},
	linkUniforms: function(gl, program, names) {
		let uniforms = {};
		for (let i = 0; i < names.length; i++) {
			let name = names[i];
			let location = gl.getUniformLocation(program, name);
			if (-1 == location) {
				/* TODO: log or warn? */
			} else {
				uniforms[name] = location;
			}
		}
		return uniforms;
	},
	MISS:-33,
	getUniformLocation: function(name) {
		return name in this.variables.uniforms ? this.variables.uniforms[name] : this.MISS;
	},
	setMatrix: function(name, matrix) {
		let location = this.getUniformLocation(name);
		if (this.MISS != location) {
			this.gl.uniformMatrix4fv(location, false, matrix);
		} else {
		}
	},
	setValue: function(name, value) {
		let location = this.getUniformLocation(name);
		if (this.MISS != location) {
			this.gl.uniform1i(location, value);
		}
	},
	getAttributeLocation: function( name ) {
		if ( name in this.variables.attributes ) {
			return this.variables.attributes[ name ];
		}
		throw "Unknown attribute name '" + name + "'";
	},
	makeBuffer: function(a,count) {
		return {
			  gl:this.gl.createBuffer()
			, data:new Float32Array(a)
			, count: ( undefined === count ) ? 3 : count
		};
	},
	useBuffer: function(name, buffer) {
		let location = this.getAttributeLocation( name );
		this.log( '--- useBuffer');

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.gl);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, buffer.data, this.gl.STATIC_DRAW); 

		//this.gl.enableVertexAttribArray(location); // swag

		this.gl.vertexAttribPointer(location, buffer.count, this.gl.FLOAT, false, 0, 0);
		this.log( '---');
		return buffer;
	},
	makeFaces: function(indices) {
		return {
			  gl:this.gl.createBuffer()
			, data: new Uint16Array(indices)
		};
	},
	useFaces: function(faces) {
		this.log( '---- useFaces' );
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, faces.gl);
		this.gl.bufferData( this.gl.ELEMENT_ARRAY_BUFFER,faces.data,this.gl.STATIC_DRAW);
		this.log( '----' );
		return faces;
	},
	log: function(whatever) {
		document.body.innerHTML += "<pre>" + whatever + "</pre>";
		console.log(whatever);
	},
	demo: function() {
		let gl = this.gl;

		let n = -1;

		let identity = new Float32Array([ 1, 0, 0, 0, /**/ 0, 1, 0, 0, /**/ 0, 0, 1, 0, /**/ 0, 0, 0, 1 ]);

		this.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );

		let colors = this.makeBuffer([1, 0, 0, /**/ 0, 1, 0, /**/ 0, 0, 1]);
		//let points = this.makeBuffer([0, 1, 0, /**/ n, n, 0, /**/ 1, n, 0]);

		let points = this.makeBuffer([ -1, -1, 0, 0, 1, 0, 1, -1, 0 ]);
		let faces = this.makeFaces([0, 1, 2]);

		//this.setMatrix(this.names.uRotationMatrix, identity);
		
		this.useBuffer(this.names.aVertexColor, colors);
		this.useBuffer(this.names.aVertexPosition, points);

		this.useFaces(faces);
		
		gl.drawElements(gl.TRIANGLES, faces.data.length, gl.UNSIGNED_SHORT, 0);
	}
};

if (true) {
	window.onload = function() {
		const demo = function() {
			let stuff = {};
			for (let i = 0; i < document.body.childNodes.length; i++) {
				let kid = document.body.childNodes[i];
				stuff[kid.id] = kid;
			}

			new FunGL(
				stuff.canvas,
				stuff.vertexShader.innerHTML,
				stuff.fragmentShader.innerHTML
			).demo();
		};
		demo();
	};
}

