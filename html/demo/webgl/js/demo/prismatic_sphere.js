import Glo             from '../lib/Glo.js';
import Mesho           from '../lib/Mesho.js';
import Mouseo          from '../lib/Mouseo.js';
import Shadero         from '../lib/Shadero.js';
import TriangularPrism from '../lib/model/TriangularPrism.js';
import Utilo           from '../lib/Utilo.js';
import Vectoro         from '../lib/Vectoro.js';

export default function() {

	/* setup */

	let setup = Glo.demoSetup( Shadero.lit, 'uMatrix', { preserveDrawingBuffer:true } );

	let gl = setup.gl;
	let program = setup.program;
	let textureProgram = Glo.program( gl, Shadero.texture.vertex, Shadero.texture.fragment );
	
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

	let keyz = setupClickHandlers({
			  fullscreen: false
			, reset:  function() { onChange( instance = TriangularPrism.instantiate() ) }
			, split:  function() { onChange( instance.subdivide() ) }
			, look:   function() { look++ }
			, mirror: function() { mirror++ }
		});

	keyz[ ' ' ] = keyz.s;
		
	keyz.e = function() { 
		let c = [1,1,1].map(v=>Math.random());
		inverted = colors.map( (v, i) => c[ i % 3 ] );
	}

	document.onkeydown = function( e ) { if ( e.key in keyz ) { keyz[ e.key ]() } }

	/* draw loop */

	const draw = function() {
		Glo.clear( gl );

		/* draw the triangular prism */

		gl.useProgram( program );
		setup.mouseLoop();

		Glo.data( gl, program, 'aPosition', instance.vertices );

		switch ( look % 3 ) {
			case 0:
				/* faces (and edges) */
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
			drawTexture( gl, textureProgram, setup.mouseControls, mirror );
		}

		setup.canvas.toBlob(function(blob) {
			document.body.style.background = 'url(' + setup.canvas.toDataURL('image/png') + ')';
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

const setupClickHandlers = function( clickHandlers ) {
	let keyz = {};
	for ( let name in clickHandlers ) {
		let target = Utilo.getByContents( name );
		if ( clickHandlers[ name ] ) {
			target.onclick = clickHandlers[ name ] 
		}
		keyz[ name[ 0 ] ] = target.onclick;
	}
	return keyz;
}

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
			c = 0.5 + ( 1 + c );
			s = 0.5 + ( 1 + s );
			let ic = 1 - c;
			let is = 1 - s;
			Glo.data( gl, textureProgram, 'aPosition', [ -1,+1, z,  +1,+1,z,  -1,-1, z,  +1,-1,z ] );
			Glo.data( gl, textureProgram, 'aTexture', [ ic,s,  c,s,  c,is,  ic,is ], 2);
	}
	Glo.draw( gl, [ 0, 1, 2,	1, 3, 2 ] );
};
