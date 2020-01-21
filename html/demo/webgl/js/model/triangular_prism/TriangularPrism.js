const TriangularPrism = {
	vertices: [
		-1,+0,+0, // 0
		+1,+0,+0, // 1
		+0,-1,+0, // 2
		+0,+1,+0, // 3
		+0,+0,-1, // 4
		+0,+0,+1  // 5
	]
	, faces: [
		4, 0, 3,
		0, 5, 3,
		5, 1 ,3,
		1, 4, 3,
		4, 0, 2,
		0, 5, 2,
		5, 1, 2,
		1, 4, 2
	]
	, subdivide: function() {
		let nuFaces = [];
		let faces = this.faces;
		let vertices = this.vertices;
		for( let i = 0 ; i < faces.length ; i+= 3 ) {
			let v0 = 3 * faces[ i + 0 ];
			let v1 = 3 * faces[ i + 1 ];
			let v2 = 3 * faces[ i + 2 ];

			// 3 new points at the midpoints
			let a = this.addMidpoint( v0, v1, vertices );
			let b = this.addMidpoint( v1, v2, vertices );
			let c = this.addMidpoint( v2, v0, vertices );

			// 4 new faces 

			v0 /= 3; v1 /= 3; v2 /= 3; a /= 3; b /= 3; c /= 3;

			nuFaces.push( v0 ); nuFaces.push( a ); nuFaces.push( c );
			nuFaces.push( v1 ); nuFaces.push( b ); nuFaces.push( a );
			nuFaces.push( v2 ); nuFaces.push( c ); nuFaces.push( b );
			nuFaces.push( a  ); nuFaces.push( b ); nuFaces.push( c );
		}
		return this.faces = nuFaces;
	}
	, addMidpoint: function( v0, v1, vertices ) {
		if( 'undefined' === typeof( this.cache ) ) {
			this.cache = {};
		}

		let key = ( v0 <= v1 ? [ v0, v1 ] : [ v1, v0 ] ).join( ',' );
		if ( key in this.cache ) {
			return this.cache[ key ];
		}

		let idx = vertices.length;
		let nu = [];
		let length = 0;
		for ( let i = 0 ; i < 3 ; i++, v0++, v1++ ) {
			let v = 0.5 * ( vertices[ v0 ] + vertices[ v1 ] );
			length += v * v;
			nu.push( v );
		}
		length = Math.sqrt( length );

		for ( let i = 0 ; i < nu.length ; i++ ) {
			nu[ i ] /= length;
		}

		this.cache[ key ] = idx;
		/* 
				   96 faces and        90 vertices vs      54   
				  384 faces and       378 vertices vs     198  
				1,536 faces and     1,530 vertices vs     774  
				6,144 faces and     6,138 vertices vs   3,078 
			   24,576 faces and    24,570 vertices vs  12,294
			   98,304 faces and    98,298 vertices vs  49,158
			  393,216 faces and   393,210 vertices vs 196,614
			1,572,864 faces and 1,572,858 vertices vs 786,438 
		*/

		vertices.push.apply( vertices, nu );
		return idx;
	}
};