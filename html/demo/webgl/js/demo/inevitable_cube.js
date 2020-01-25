import Glo     from '../lib/Glo.js';
import Matrixo from '../lib/Matrixo.js';
import Shaders from '../lib/Shaders.js';
import Utilo   from '../lib/Utilo.js';
import Mouseo  from '../lib/Mouseo.js';
import Vectoro from '../lib/Vectoro.js';

const SQRT_3 = Math.sqrt( 3 );
const INVERSE_SQRT_3 = 1 / SQRT_3;

const inevitable_cube = function() {
	let canvas = Utilo.getByTag( 'canvas' );
	let mouseControls = Mouseo.simpleControls( canvas );

	let gl = Glo.gl( canvas );

	let program = Glo.program( gl, Shaders.simple.vertex, Shaders.simple.fragment );

	let cube = makeCube();

	let cyans  = cube.vertices.map( function( v, i ) { return i % 3 ? 1 : 0 } );
	let colors = cube.vertices.map( function( v ) { 
		return ( v + INVERSE_SQRT_3 ) / ( INVERSE_SQRT_3 * 2 );
	} );

	let draw = function() {
		Glo.clear( gl );

		mouseControls.idle( 5000, 0.03 );
		let m = Matrixo.multiply( mouseControls.matrix(), Matrixo.scale( 0.66 ) );
		Glo.matrix( gl, program, 'uMatrix', m );

		// triangles
		Glo.data( gl, program, 'aPosition', cube.vertices );
		Glo.data( gl, program, 'aColor', colors );
		Glo.draw( gl, cube.triangles );

		// edges
		// this is interesting: https://mattdesl.svbtle.com/drawing-lines-is-hard
		Glo.data( gl, program, 'aColor', cyans );
		Glo.draw( gl, cube.edges, gl.LINES );

		// draw the normals
		Glo.data( gl, program, 'aPosition', cube.centroids );
		Glo.data( gl, program, 'aColor', cube.centroid_colors );
		Glo.draw( gl, cube.centroid_lines, gl.LINES );

		setTimeout( function() { requestAnimationFrame( draw ) }, 50 );
	}

	draw();
};

const v3po = function( v ) {
	return ( '0' == v ) ? -INVERSE_SQRT_3 : parseInt( v ) * INVERSE_SQRT_3;
};

const makeCubePointsUsingBinaryStrings = function() {
	let points = [];
	for ( let i = 0 ; i < 8 ; i++ ) {
		points.push(
			( '00' + i.toString( 2 ) )
			.split( '' )
			.map( v3po )
			.slice( -3 )
		);
	}
	return points;
};

const makeCubePoints = function() {
	return makeCubePointsUsingBinaryStrings();
};

const makeCube = function() {
	let s2 = Vectoro.toString;
	let cube = {
		  points:[]
		, vertices:[]
		, faces:[]
		, edges:[]
		, triangles:[]
		, normals:[]
		, centroids:[]
	};

	cube.points = makeCubePoints();

	let fx = 0;

	for ( let dimension = 0 ; dimension < 3 ; dimension++ ) {
		for ( let sign = -1 ; sign <= +1 ; sign += 2, fx++ ) {
			let value = sign * INVERSE_SQRT_3;
			let centroid = [0,0,0];
			centroid[ dimension ] = value;
			cube.centroids = cube.centroids.concat( centroid );

			// look for points that match the search criteria
			let indices = [];
			for ( let i = 0 ; i < cube.points.length ; i++ ) {
				let vertex = cube.points[ i ];
				if ( vertex[ dimension ] == value ) {
					indices.push( i );
				}
			}

			// results always have first 3 points of one corner first
			// so just flip last 2 points to make a side
			let tmp = indices[ 3 ];
			indices[ 3 ] = indices[ 2 ];
			indices[ 2 ] = tmp;


			// use the normal so the faces point the 
			// right direction

			let normal = Vectoro.normalVector( 
				cube.points[ indices[ 0 ] ],
				cube.points[ indices[ 1 ] ],
				cube.points[ indices[ 2 ] ]
			);	
			if ( Vectoro.dot( centroid, normal ) < 0 ) {
				indices = indices.reverse();
				normal = Vectoro.scale( -1, normal );
			}

			cube.normals.push( normal ); // idk what to use this for yet...
			let c2 = Vectoro.add( Vectoro.scale( 0.13, normal ), centroid );
			cube.centroids = cube.centroids.concat( c2 );

			// guess this is just for fun...
			cube.faces = cube.faces.concat( indices ); 

			// triangle 1
			cube.triangles.push( indices[ 0 ] );
			cube.triangles.push( indices[ 1 ] );
			cube.triangles.push( indices[ 2 ] );

			// triangle 2
			cube.triangles.push( indices[ 2 ] );
			cube.triangles.push( indices[ 3 ] );
			cube.triangles.push( indices[ 0 ] );
		
			// edges are quirky.... need begin and end index
			for ( let i = 0 ; i < indices.length ; i++ ) {
				cube.edges.push( indices[ i ] );
				if ( i ) { 
					cube.edges.push( indices[ i ] );
				}
			}
			cube.edges.push( indices[ 0 ] );
		}
	}

	for ( let i = 0 ; i < cube.points.length ; i++ ) {
		cube.vertices = cube.vertices.concat( cube.points[ i ] );
	}

	cube.centroid_lines = [];
	cube.centroid_colors = [];
	let centroid_count = cube.centroids.length / 3;
	
	let orange = [ 1, 1, 0 ];
	cube.centroid_colors = cube.centroid_colors.concat( orange );
	for ( let i = 0 ; i < centroid_count ; i++ ) {
		cube.centroid_colors = cube.centroid_colors.concat( orange );
	}

	for ( let i = 0 ; i < centroid_count ; i += 2  ) {
		cube.centroid_lines.push( i + 0 );
		cube.centroid_lines.push( i + 1 );
	}

	return cube;
};
			
inevitable_cube();
