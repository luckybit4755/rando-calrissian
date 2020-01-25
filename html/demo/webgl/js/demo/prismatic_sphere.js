import Glo             from '../lib/Glo.js';
import Matrixo         from '../lib/Matrixo.js';
import Mesho           from '../lib/Mesho.js';
import Mouseo          from '../lib/Mouseo.js';
import Shaders         from '../lib/Shaders.js';
import Vectoro         from '../lib/Vectoro.js';
import Utilo           from '../lib/Utilo.js';
import TriangularPrism from '../lib/model/TriangularPrism.js';

const prismatic_sphere = function() {
	let canvas = Utilo.getByTag( 'canvas' );

	/* setup */

	let gl = Glo.gl( canvas, {preserveDrawingBuffer:true} );
	let program = Glo.program( gl, Shaders.lit.vertex, Shaders.lit.fragment );
	let textureProgram = Glo.program( gl, Shaders.texture.vertex, Shaders.texture.fragment );
	
	/* model object stuff */

	let edges, colors, inverted;
	let onChange = function( t ) {
		edges = Mesho.facesToEdges( t.faces );
		colors = t.vertices.map( v => 0.5 * ( 1 + v ) );
		inverted = colors.map( v => 1 - v );
		console.log( [t.faces,t.vertices].map(v=>v.length).join( ' x ' ) );
		return t;
	}
	let instance = onChange( TriangularPrism.instantiate() );

	/* things about drawing */

	let image = new Image();
	let texture_ready = false;
	let show_texture = false;

	let look = 0;
	let mirror = 0;

	/* event handlers */

	let mouseControls = Mouseo.simpleControls( canvas );

	let keyz = {};
	document.onkeydown = function( e ) { if ( e.key in keyz ) { keyz[ e.key ]() } }

	keyz.f = Utilo.getByContents( 'fullscreen' ).onclick = function() { 
		Utilo.fullscreen( canvas ); 
	};

	keyz[ ' ' ] = keyz.s = Utilo.getByContents( 'split' ).onclick = function() {
		onChange( instance.subdivide() );
	};

	keyz.r = Utilo.getByContents( 'reset' ).onclick = function() {
		onChange( instance = TriangularPrism.instantiate() );
	};

	keyz.l = Utilo.getByContents( 'look' ).onclick = function() { look++; };

	keyz.m = Utilo.getByContents( 'mirror' ).onclick = function() { mirror++; };

	keyz.e = function() { 
		let c = [1,1,1].map(v=>Math.random());
		inverted = colors.map( (v, i) => c[ i % 3 ] );
	}

	/* draw loop */

	const draw = function() {
		Glo.clear( gl );

		/* draw the triangular prism */

		gl.useProgram( program );

		mouseControls.idle( 3000, 0.03 );
		let m = Matrixo.multiply( mouseControls.matrix(), Matrixo.scale( 0.66 ) );
		Glo.matrix( gl, program, 'uMatrix', m );

		Glo.data( gl, program, 'aPosition', instance.vertices );

		switch ( look % 3 ) {
			case 0:
				/* faces and edges */
				Glo.data( gl, program, 'aColor', colors );
				Glo.draw( gl, instance.faces );
			case 1:
				/* just edges */
				Glo.data( gl, program, 'aColor', inverted );
				Glo.draw( gl, edges, gl.LINES );
				break;
			case 2:
				/* just faces */
				Glo.data( gl, program, 'aColor', colors );
				Glo.draw( gl, instance.faces );
		}

		/* draw the texture image */

		if ( texture_ready ) {
			drawTexture( gl, textureProgram, mouseControls, mirror );
		}

		canvas.toBlob(function(blob) {
			document.body.style.background = 'url(' + canvas.toDataURL('image/png') + ')';
			let url = URL.createObjectURL( blob );
			image.onload = function() {
				Glo.textureSetup( gl, program, image );
				Glo.texture( gl, program, 'uSampler', image );
				texture_ready = true;

				URL.revokeObjectURL( url );
				setTimeout( function() { requestAnimationFrame( draw ) }, 22 );
			};
			image.src = url;
		})
	};
	draw();
};

const drawTexture = function( gl, textureProgram, mouseControls, mirror ) {
	mirror = mirror % 5;
	if ( 0 == mirror ) return;

	gl.useProgram( textureProgram );
	let a = mouseControls.getAngleX()
	let c = Math.cos( a );
	let s = Math.sin( a );
	let x = c / 2 - 0.88;
	let y = s / 2 - 0.88;
	let z = 0.9;

	switch( mirror ) {
		case 1:
			x = 0.5 + ( 1 + c );
			y = 0.5 + ( 1 + s );
			Glo.data( gl, textureProgram, 'aPosition', [ -1,+1, z,  +1,+1,z,  -1,-1, z,  +1,-1,z ] );
			Glo.data( gl, textureProgram, 'aTexture', [ -x,+y, +x,+y, -x,-y, +x,-y ], 2);
			break;
		case 2:
			Glo.data( gl, textureProgram, 'aPosition', [ -1,+1, 0.9,  +0,+1,0.9,  -1,+0, 0.9,  +0,+0,0.9 ] );
			Glo.data( gl, textureProgram, 'aTexture', [ 0,0,  1,0,  0,1,  1,1 ], 2);
			break;
		case 3:
			Glo.data( gl, textureProgram, 'aPosition', [ x,y,z,   x+1,y,z, x,y+1,z, x+1,y+1,z ] );
			Glo.data( gl, textureProgram, 'aTexture', [ 0,0,  1,0,  0,1,  1,1 ], 2);
			break;
		default:
			// noop is interesting somehow..
			c = 0.5 + ( 1 + c );
			s = 0.5 + ( 1 + s );
			let ic = 1 - c;
			let is = 1 - s;
			Glo.data( gl, textureProgram, 'aPosition', [ -1,+1, z,  +1,+1,z,  -1,-1, z,  +1,-1,z ] );
			Glo.data( gl, textureProgram, 'aTexture', [ ic,s,  c,s,  c,is,  ic,is ], 2);
	}
	Glo.draw( gl, [ 0, 1, 2,	1, 3, 2 ] );
};

prismatic_sphere();
