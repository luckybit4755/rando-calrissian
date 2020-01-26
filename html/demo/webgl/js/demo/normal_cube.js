import Constantso from '../lib/Constantso.js';
import Cube       from '../lib/model/Cube.js';
import Glo        from '../lib/Glo.js';
import Matrixo    from '../lib/Matrixo.js';
import Mesho      from '../lib/Mesho.js';
import Mouseo     from '../lib/Mouseo.js';
import Shadero    from '../lib/Shadero.js';
import Utilo      from '../lib/Utilo.js';
import Vectoro    from '../lib/Vectoro.js';

const normal_cube = function() {
	let canvas = Utilo.getByTag( 'canvas' );

	Utilo.getByTag( 'button' ).onclick = function() { Utilo.fullscreen( canvas ); };
	let mouseControls = Mouseo.simpleControls( canvas );
	
	////

	let gl = Glo.gl( canvas );
	let program = Glo.program( gl, Shadero.normal.vertex, Shadero.normal.fragment );

	let vertices = Cube.vertices;
	let faces = Mesho.triangulate( Cube.faces, Cube.perFace );
	let normals = Mesho.normals( faces, vertices );

	let uniqued = Mesho.uniqVertices( faces, vertices, normals );
	faces    = uniqued.faces;
	vertices = uniqued.vertices;
	normals  = uniqued.normals;

	let colors = cubeColors();

	/* load the cube map */

	let images = Utilo.getByTag( 'img', '*' ).map( v=>v.src );
	images = images.sort( ( a, b ) => Math.random() - 0.5 );
	loadCubeMap( gl, program, 'uCubeSampler', images );

	let draw = function() {
		Glo.clear( gl );

		mouseControls.idle( 5000, 0.03 );
		let m = Matrixo.multiply( mouseControls.matrix(), Matrixo.scale( 0.44 ) );
		Glo.matrix( gl, program, 'uMatrix', m );

		Glo.data( gl, program, 'aPosition', vertices );
		Glo.data( gl, program, 'aColor', colors );
		Glo.data( gl, program, 'aNormal', normals );
		Glo.draw( gl, faces );

		setTimeout( function() { requestAnimationFrame( draw ) }, 22 );
	};

	draw();
};

const cubeColors = function( faces ) {
	let cubeFaces = 6;
	let trianglesPerFace = 2;
	let valuesPerColor = 3; // values per color
	let verticesPerFace = 3; // vertices per face

	let count = cubeFaces * trianglesPerFace * valuesPerColor;
	let faceStride = trianglesPerFace * verticesPerFace;

	let colors = [];
	let values = Utilo.flatten( Constantso.colors );

	for ( let i = 0 ; i < count ; i++ ) {
		let index = valuesPerColor * Math.floor( i /  faceStride );
		for ( let j = 0 ; j < valuesPerColor ; j++ ) {
			colors.push( values[ index + j ] );
		}
	}

	return colors;
};

const loadCubeMap = function( gl, program, name, sources ) {
	let texture = Glo.cubemapSetup( gl );
	for ( let i = 0 ; i < sources.length ; i++ ) {
		loadCubeMapFace( gl, program, name, texture, Glo.cubefaceByIndex( gl, i ), sources[ i ] );
	}
};

const loadCubeMapFace = function( gl, program, name, texture, face, source ) {
	let image = new Image();
	
	image.onload = function() {
		Glo.cubemap( gl, program, name, texture, image, face );
		console.log( source + ' -> ' + image.width + ' x ' + image.height );
	}
	image.src = source;

};




normal_cube();
