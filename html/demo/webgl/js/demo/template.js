import Glo        from '../lib/Glo.js';
import Mesho      from '../lib/Mesho.js';
import Shadero    from '../lib/Shadero.js';
import Utilo      from '../lib/Utilo.js';

export default function() {
	let setup = Glo.demoSetup( Shadero.lit );

	let mesh = {
		attributes:{
			  aPosition: [ 0,1,0, 1,0,0, 0,0,0 ]
			, aColor:    [ 1,0,0, 0,1,0, 0,0,1 ]
		}
		, faces: [ 0,1,2 ]
	}

	let axis = Mesho.axis();
	axis.type = setup.gl.LINES;

	let draw = function() {
		setup.mouseLoop( );
		Glo.drawMesh( setup.gl, setup.program, mesh );
		Glo.drawMesh( setup.gl, setup.program, axis );
	};

	Utilo.frame( draw, 60 ).start();
};
