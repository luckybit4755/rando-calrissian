import Constantso from '../lib/Constantso.js';
import Glo        from '../lib/Glo.js';
import Matrixo    from '../lib/Matrixo.js';
import Mesho      from '../lib/Mesho.js';
import Mouseo     from '../lib/Mouseo.js';
import Shadero    from '../lib/Shadero.js';
import Utilo      from '../lib/Utilo.js';
import Vectoro    from '../lib/Vectoro.js';

const template = function() {

	/* little dom fun */

	let canvas = Utilo.getByTag( 'canvas' );
	let mouseControls = Mouseo.simpleControls( canvas );
	Utilo.getByContents( 'fullscreen' ).onclick = function() { Utilo.fullscreen( canvas ); };

	/* setup */

	let gl = Glo.gl( canvas );
	let program = Glo.program( gl, Shadero.lit.vertex, Shadero.lit.fragment );

	let faces    = [ 0,1,2 ];
	let vertices = [ 0,1,0, 1,0,0, 0,0,0 ];
	let colors   = [ 1,0,0, 0,1,0, 0,0,1 ];

	let axis = Mesho.axis();

	/* drawing loop */

	let draw = function() {
		Glo.clear( gl );

		mouseControls.idle( 5000, 0.03 );
		let m = Matrixo.multiply( mouseControls.matrix(), Matrixo.scale( 0.66 ) );
		Glo.matrix( gl, program, 'uMatrix', m );

		Glo.data( gl, program, 'aPosition', vertices );
		Glo.data( gl, program, 'aColor', colors );
		Glo.draw( gl, faces );

		Glo.data( gl, program, 'aPosition', axis.vertices );
		Glo.data( gl, program, 'aColor', axis.colors );
		Glo.draw( gl, axis.faces, gl.LINES );

		setTimeout( function() { requestAnimationFrame( draw ) }, 22 );
	};

	draw();
};

template();
