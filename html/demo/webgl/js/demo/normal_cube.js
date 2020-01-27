import Cube    from '../lib/model/Cube.js';
import Glo     from '../lib/Glo.js';
import Mesho   from '../lib/Mesho.js';
import Shadero from '../lib/Shadero.js';
import Utilo   from '../lib/Utilo.js';

export default function() {
	/* setup the context */

	let setup = Glo.demoSetup( Shadero.normal, 'uMatrix' );
	
	/* load and prepare the cube mesh */

	let mesh = Mesho.normalize( Cube );
	mesh.attributes = { 'aPosition': mesh.vertices, 'aNormal': mesh.normals };

	/* setup the cubemap */

	Glo.cubemap( setup.gl, setup.program, 'uCubeSampler', Utilo.getByTag( 'img', '*' ) );

	/* the drawing loop */

	let draw = function() {
		setup.mouseLoop();
		Glo.drawMesh( setup.gl, setup.program, mesh );
	};

	Utilo.frame( draw, 60 ).start();
};
