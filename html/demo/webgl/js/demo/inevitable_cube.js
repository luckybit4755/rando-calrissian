import Glo     from '../lib/Glo.js';
import Matrixo from '../lib/Matrixo.js';
import Shadero from '../lib/Shadero.js';
import Utilo   from '../lib/Utilo.js';
import Mouseo  from '../lib/Mouseo.js';
import Vectoro from '../lib/Vectoro.js';

const SQRT_3 = Math.sqrt( 3 );
const INVERSE_SQRT_3 = 1 / SQRT_3;

export default function() {
	let setup = Glo.demoSetup( Shadero.simple );

	let cube = makeCube();

	let cyans  = cube.vertices.map( function( v, i ) { return i % 3 ? 1 : 0 } );
	let colors = cube.vertices.map( function( v ) { 
		return ( v + INVERSE_SQRT_3 ) / ( INVERSE_SQRT_3 * 2 );
	} );

	let mesh = {
		attributes: { aPosition:cube.vertices, aColor:colors }
		, faces:cube.triangles
	};

	let edgeMesh = {
		attributes: { aPosition:cube.vertices, aColor:cyans }
		, faces:cube.edges
		, type:setup.gl.LINES
	};

	let normalMesh = {
		attributes: { aPosition:cube.centroids, aColor:cube.centroid_colors }
		, faces:cube.centroid_lines
		, type:setup.gl.LINES
	};

	let draw = function() {
		setup.mouseLoop();
		Glo.drawMesh( setup.gl, setup.program, mesh );
		Glo.drawMesh( setup.gl, setup.program, edgeMesh );
		Glo.drawMesh( setup.gl, setup.program, normalMesh );
	};

	Utilo.frame( draw, 60 ).start();
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
