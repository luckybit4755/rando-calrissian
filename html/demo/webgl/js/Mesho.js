const Mesho = {
	// quick and hacky
	triangulate: function( faces, perFace ) {
		perFace = Utilo.idk( perFace, 4 );

		let nu = [];
		for ( let i = 0 ; i < faces.length ; i += perFace ) {
			let next = i + perFace;
			for ( let j = i ; j < next ; j+= 2 ) {
				let end = j + 3;
				if ( end >= next ) {
					end = j + 2;
				}
				for ( let k = j ; k < end ; k++ ) {
					nu.push( faces[ k ] );
				}
			}
			nu.push( faces[ i ] );
		}
		return nu;
	}
	, normals: function( faces, vertices, perFace ) {
		perFace = Utilo.idk( perFace, 3 );

		let normals = [];
		for ( let i = 0 ; i < faces.length ; i += perFace ) {
			let vertexIndex0 = 3 * faces[ i + 0 ];
			let vertexIndex1 = 3 * faces[ i + 1 ];
			let vertexIndex2 = 3 * faces[ i + 2 ];

			let vertex0 = vertices.slice( vertexIndex0, vertexIndex0 + 3 );
			let vertex1 = vertices.slice( vertexIndex1, vertexIndex1 + 3 );
			let vertex2 = vertices.slice( vertexIndex2, vertexIndex2 + 3 );

			let normal = Vectoro.normalVector( vertex0, vertex1, vertex2 );

			for ( let k = 0 ; k < perFace ; k++ ) {
				normals.push( normal[ k ] );
			}
		}
		
		return normals;
	}
	// create a set of vertices and normals unique for each face
	// needs to be triangles at this point...
	// normals.length should equal faces.length
	, uniqVertices: function( faces, vertices, normals ) {
		let nuFaces = [];
		let nuNormals = [];
		let nuVertices = [];

		for ( let i = 0 ; i < faces.length ; i++ ) {
			let faceIndex = 3* Math.floor( i / 3 );
			let oldIndex = 3 * faces[ i ];

			nuFaces.push( nuVertices.length / 3 );

			// copy over the old position and normal data for this 
			// face vertex
			for ( let k = 0 ; k < 3 ; k++ ) {
				nuVertices.push( vertices[ oldIndex + k ] );
				nuNormals.push( normals[ faceIndex + k ] ); 
			}
		}

		return { faces:nuFaces, vertices:nuVertices, normals:nuNormals };
	}
	, facesToEdges: function( faces, perFace ) {
		perFace = Utilo.idk( perFace, 3 );

		let edges = [];
		for ( let i = 0 ; i < faces.length ; i+= perFace ) {
			for ( let j = 0 ; j < perFace ; j++ ) {
				edges.push( faces[ i + j ] );
				if ( perFace - 1 == j ) {
					edges.push( faces[ i + 0  ] );
				} else {
					edges.push( faces[ i + j + 1 ] );
				}   
			}   
		}       
		return edges;
	}  
	, axis: function() {
		let vertices = [];
		let faces = [];
		let colors = [];
		let k = Object.values( Constantso.colors );
		for ( let d = 0 ; d < 3 ; d++ ) {
			for ( let v = -1 ; v < 2 ; v += 2 ) {
				//colors = colors.concat( Object.values( Constantso.colors )[ d ] );
				for ( let p = 0 ; p < 3 ; p++ ) {
					colors.push( k[ d ][ p ] );
					vertices.push( p == d ? v : 0 );
				}
				faces.push( faces.length );
			}
		}
		return { vertices:vertices, faces:faces, colors:colors };
	}
};
