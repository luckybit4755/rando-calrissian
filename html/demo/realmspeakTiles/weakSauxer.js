#!/usr/bin/env node 

const fs = require( 'fs' );

/**
 *
 * It's no joke, but maybe I should see a professional, cuz 2020, I'm trying
 * to shallow parse XML like a lunatic o.O
 *
 * The biggest issue I had with other converters was they decided on the arity 
 * of elements in the local scope instead of the document scope. This lead to
 * inconsistencies in the way elements were handled.
 *
 * Aside from the madness of using regular expressions to convert XML to JSON,
 * the main purpose is to create a consistence implicit scheme in the output.
 * This is attempted (and hopefully achieved) by considering elements at the
 * same level of the document hierarchy and generalizing only with a complete
 * view of the overall structure.
 *
 * @author Valerie Grafin von FunFun
 *
 */
const weakSauxer = function() {
	const self = this;

	self.main = function( args ) {
		//cheese
		if ( 'test' === args[ 0 ] ) {
			return self.test();
		}

		//fs.readFile( args[ 0 ], 'utf-8', self.convert );
		fs.readFile( args[ 0 ], 'utf-8', (e,d)=>self.scrub(JSON.parse(d)) );
	};

	self.convert = function( e, d ) {
		if ( e ) throw e;

		let xml = self.simplify( d );
		fs.writeFile( 'ugly.xml', xml ,(e,d)=>{if(e) throw e});

		let json = self.toJson( xml );
		fs.writeFile( 'ugly.json', json, (e,d)=>{if(e) throw e});

		// moment of truth
		let verified = JSON.parse( json );
		json = JSON.stringify( verified, false, '\t' );
		fs.writeFile( 'ugli.json', json, (e,d)=>{if(e) throw e});

		self.scrub( verified );
	}

	self.simplify = function( xml ) {
		let debug = false;
		const g = 'g';

		let simple = '';

		// line-by-now for now..
		let lines = xml.split( '\n' );
		for( let i = 0 ; i < lines.length ; i++ ) {
			let line = lines[ i ].trim();
			if ( debug ) console.error( '<| ' + line );

			line = line
				// consistent spacing
				.replace( /[\s\n\r]+/g, ' ' )
				
				// get rid of the shortcuts endings
				.replace( /<([^ ]+) ([^>]+)\/>/g, '<$1 $2></$1>' ) 

				// convert attributes to subelements
				// <ok a="1" b="2">  --> <ok>  a="1" b="2"
				.replace( /<([^ ]+) ([^>]+)>/g, '<$1> $2 ' )
				.replace( new RegExp( ' ([^=]+)="([^"]*)"', g ), '<$1>$2</$1>' )

				// remove extra spaces
				.replace( /> +</g, '><' )

			if ( debug ) console.error( '>| ' + d );
			if ( debug ) console.error( '-----------------------------------------------------------------------------' );
			simple += line.trim();
		}

		simple = simple.replace( /> +</g, '><' );

		return simple;
	};

	self.toJson = function( xml ) {
		return xml
			.replace( />([^>]+)</g, '>"$1"<' )    // every value is quoted
			.replace( /<\/[^>]+>/g, ']}' )        // each close xml tag becomes an array  and object close
			.replace( /<([^>]+)>/g, '{"$1":[' )   // each open  xml tag becomes an object and array  open
			.replace( /}{/g, '},{' )              // everything in a list is comma separated
		;
	}

	/////////////

	self.test = function() {
		let tests = [
			, [ self.anyNumber               , {a:"1"}                       , {a:1}             ] // 1
			, [ self.anyNumber               , {a:["1"]}                     , {a:[1]}           ] // 2
			, [ self.collapseArrays          , {a:[1]}                       , {a:1}             ] // 3
			, [ self.collapseArrays          , {a:[]}                        , {a:"<<EMPTY>>"}   ] // 4
			, [ self.collapseObjects         , {a:{b:1}}                     , {"a:b":1}           ] // 5
			, [ self.collapseObjects         , {a:{b:1,c:2,d:3}}             , {"a:b":1,"a:c":2,"a:d":3} ] // 6
			, [ self.collapseObjects         , {a:{b:1},c:{d:2,e:[3,4]}}     , null              ] // 7
			, [ self.collapseArraysOfObjects , {z:[{a:1},{b:2},{b:3},{c:4}]} , null              ] // 8
			, [ self.collapseArraysOfObjects , {z:[{a:1},{b:2},{c:3}]}       , {z:{a:1,b:2,c:3}} ] // 9
		];

		let debug = false;

		for ( let i = 0 ; i < tests.length ; i++ ) {
			if ( debug && i != debug ) continue;

			let test = tests[ i ];
			if ( !test ) continue;

			let fn = test[ 0 ];
			let b4 = test[ 1 ];
			let l8 = test[ 2 ] || b4;

			console.error( '-----------------------------------------------------------------------------' );
			console.error( 'running test #' + i );

			let out = Array.isArray( b4 ) ? b4.slice() : Object.assign( {}, b4 );
			fn( out, debug );

			console.error( '> b4: ' + self.s( b4 ) );
			let exp = self.s( l8 );
			let jsn = self.s( out );
			console.error( '> l8: ' + exp );
			console.error( '> to: ' + jsn );

			let ok = ( exp == jsn );
			console.error( ok ? 'SUCCESS' : 'ERROR!' );
			if ( !ok ) break;
		}

		return ;
	};
	
	self.scrub = function( elo ) {
		
		for ( let i = 0 ; i < 99; i++ ) {
			let collapsed = 0;
			collapsed += self.collapseArrays( elo );    // {a:[1]}           -> {a:1}
			collapsed += self.collapseObjects( elo ); // {a:{b:1,c:2,d:3}} -> {b:1,c:2,d:3}
			collapsed += self.collapseArraysOfObjects( elo );

			if( !collapsed ) break;

			console.error( i + '> collapsed:' + collapsed );
		}

		//self.typical( elo );
		console.log( self.z( elo ) );// snit
	};

	self.typical = function( elo, hunt ) {
		let pathic = {};
		let pathed = {};

		self.walk( elo, function( key, value, type, path, parent ) {
			path = self.removeArrayIndexes( path, '/<n>' );
			if ( !path.length ) return;

			type = type.toString().replace( /\(.*/, '' );
			if ( path in pathed ) {
				pathed[ path ].push( value );
			} else {
				pathed[ path ] = [ value ];
			}
			self.addValue( pathic, path, type );

			if( hunt === path ) {
				console.error( '-----------------------------------------------------------------------------' );
				console.error( 'path info for :' + path + ' is ' + type );
				console.error( self.z( value ) );
				console.error( '-----------------------------------------------------------------------------' );
			}
		});

		for ( let path in pathic ) {
			let types = pathic[ path ];
			let typeCount = Object.keys( types ).length;

			let simple = ( 1 == typeCount );
			if ( 2 == typeCount && ( 'array.empty' ) in types && ( 'array.single' in types ) ) {
				simple = true;
			}
			if ( 2 == typeCount && ( 'string.number' ) in types && ( 'string.number' in types ) ) {
				simple = true;
			}

			if ( ( 'array.multiple' in types ) || ( 'object.multiple' in types ) ) {
				simple = false;
			}


			console.error( path + ' and ' + ( simple ? 'simple' : 'complicated' ) );

			for ( let type in types ) {
				let count = types[ type ];
				console.error( '- ' + self.leftPad( ''+count, 5 ) + ' : ' + type );
			}

		}

		//console.error( 'globally:' + JSON.stringify( global, false, '\t' ) );
		//console.error( 'pathic:' + JSON.stringify( pathic, false, '\t' ) );
	};

	// result: {a:"1"} -> {a:1}
	self.anyNumber = function( elo, debug ) {
		self.walk( elo, function( key, value, type, path, parent ) {
			// TODO: might need / want to do this based on path...
			if ( debug ) {
				console.error( 'anyNumber.check: ' + path + ' -> ' + self.s( value ) + ' is ' + type );
			}
			if ( type.is( 'string', 'number' ) ) {
				// somehow, type.numerical is a string again???
				parent[ key ] = parseFloat( value );
			}
		});
	}

	// result: {a:[b]} -> {a:b}
	// result: {a:[]} -> {a:B} where B is some gross / crazy value 
	self.collapseArrays = function( elo, debug ) {
		let collapsed = 0;

		let allArrays = {};
		let aTypes = {};
		
		let what = '<<>>';

		self.walk( elo, function( key, value, type, path ) {
			if ( debug > 2 ) {
				console.error( 'collapseArrays.check: ' + path + ' -> ' + self.s( value ) + ' is ' + type );
			}

			if ( 'array' !== type.major || value.length > 1 ) return;

			if ( debug > 1 ) {
				console.error( 'collapseArrays.target: ' + path + ' -> ' + self.s( value ) + ' is ' + type.minor );
			}

			path = self.removeArrayIndexes( path, what );
			self.addToObject( self.getSubject( allArrays, path ), type.minor );

			// sometimes a path may be mostly single valued but sometimes empty
			// in these cases it'd be nice to replace the empties with a "reasonable" 
			// value and collapse them too... for type like number, string.number and 
			// maybe strings this might be ok...
			if ( 'single' === type.minor ) {
				let firstType = self.myType( value[ 0 ] );
				self.addToObject( self.getSubject( aTypes, path ), firstType.toString() );
			}
		})
		
		if ( debug > 1) {
			console.error( 'collapseArrays.allArrays: ' + self.s( allArrays ) );
		}


		let collapseable = {};

		let precedence = 'multiple single'.split( ' ' );
		for ( let path in allArrays ) {
			let counts = allArrays[ path ];
			let type = 'empty';
			for ( let i = 0 ; i < precedence.length ; i++ ) {
				if ( precedence[ i ] in counts ) {
					type = precedence[ i ];
					break;
				}
			}
			if ( 'multiple' === type ) continue; // cannot collapse an actual array

			if ( 'single' === type && 1 != Object.keys( counts ).length ) {
				let typeKeys = Object.keys( aTypes[ path ] );
				if ( 1 == typeKeys.length ) {
					type = typeKeys[ 0 ];
				} else {
					// inconsistent types... idk what to do here...
					continue;
				}
			}
			if( debug ) {
				console.error( 'collapseArrays.collapseable:'+self.pad( path, 44 ) + ' -> ' + type + ' cuz ' + JSON.stringify( counts ) );
			}
			collapseable[ path ] = type;
		}

		if ( debug ) {
			console.error( '-----------------------------------------------------------------------------' );
		}

		self.walk( elo, function( key, value, type, path, parent ) {
			if ( 'array' !== type.major ) return;
			path = self.removeArrayIndexes( path, what );

			if ( !( path in collapseable ) ) return;
			let collapseType = collapseable[ path ];

			switch( collapseType ) {
				case 'empty':          value = '<<EMPTY>>'; break;
				case 'string.string': value = '<<EMPTY_STRING>>'; break;
				case 'single':         
					value = value[ 0 ];
					if ( '' == value ) value = '<<EMPTY_STRANG>>'; // weird...
			}

			parent[ key ] = value; // still not sure this is a good idea...

			if ( debug ) {
				console.error( 'collapseArrays.collapse:' + self.pad( path, 44 ) + ' -> ' + collapseType + ' -> ' + self.s( value ));

			}

			collapsed++;
		});

		console.error( 'I collapsed ' + collapsed + ' arrays' );
		return collapsed;
	};

	self.s = function( o ) { return JSON.stringify( o ); };
	self.z = function( o ) { return JSON.stringify( o, false, '\t' ); };

	// result: {a:{b:c}} -> {a_b:c}
	self.collapseObjects = function( elo, debug ) {
		let collapsed = 0;

		let what = '<<>>';
		let shallow = {};
		self.walk( elo, function( key, value, type, path ) {
			// ignore the key, look at value is {"a":{"b":"c"}}
			if ( 'object' !== type.major ) return;
			let keys = Object.keys( value );
			if ( 1 != keys.length ) return;
			
			let child = value[ keys[ 0 ] ];
			let childType = self.myType( child );
			if ( 'object' !== childType.major ) return;

			path = self.removeArrayIndexes( path, what );
			path += '/' + keys[ 0 ] // hmm...

			self.addToObject( self.getSubject( shallow, path ), type.minor );
		});

		if ( debug ) {
			console.error( 'collapseObjects.shallow:' + self.z( shallow ) );
		}

		let toCollapse = {};
		for ( let k in shallow ) {
			let v = shallow[ k ];
			if ( 1 == Object.keys( v ).length && 'single' in v ) {
				toCollapse[ k ] = k;
			}
		}

		if ( debug ) {
			console.error( 'collapseObjects.toCollapse:' + self.z( shallow ) );
		}

		self.walk( elo, function( key, value, type, path ) {
			path = self.removeArrayIndexes( path, what );
            if ( 'object' !== type.major ) return;

			let keys = Object.keys( value );
			if ( 1 != keys.length ) return;
			let childKey = keys[ 0 ];

			path += '/' + childKey;
			if ( !( path in toCollapse ) ) return;

			let child = value[ childKey ];
			let nu = {};
			for ( let k in child ) {
				nu[ childKey + ':' + k ] = child[ k ];
			}
			delete value[ childKey ];
			Object.assign( value, nu );

			collapsed++;
		});

		console.error( 'I collapsed ' + collapsed + ' objects' );
		return collapsed;
	};

	// result: [{a:z},{b:y},{c:w}] -> {a:1,b:2,c:3} 
	self.collapseArraysOfObjects = function( elo, debug ) {
		let collapsed = 0;
		let what = '<<>>';

		let shallow = {};
		self.walk( elo, function( key, value, type, path, parent ) {

			if ( 'array' !== type.major ) return;
			path = self.removeArrayIndexes( path, what );

			let isShallow = true;
			let seen = {};

			for ( let i = 0 ; i < value.length && isShallow ; i++ ) {
				let e = value[ i ];
				let eType = self.myType( e ).major;
				if ( false
					|| ( 'object' != eType )
					// allow for multiple non-collision objects may bust everything...|| ( 1 != Object.keys( e ).length )  // scary....
				) {
					isShallow = false;
				}

				for ( let k in e ) {
					let v = e[ k ];
					let t = self.myType( v );
					if ( k in seen ) { // not sure we care...|| 'object' === t.major || 'array' === t.major ) {
						isShallow = false;
						break;
					}
					seen[ k ] = k;
				}
			}
			if ( debug ) {
				console.error( 'collapseObjects.shallow:' + self.pad( path, 44 ) + ' -> ' + isShallow );
			}

			self.addToObject( self.getSubject( shallow, path ), isShallow );
		});

		// make sure they are always shallow..
		let toCollapse = {};
		for ( let k in shallow ) {
			let v = shallow[ k ];
			if ( 1 == Object.keys( v ).length && true in v ) {
				toCollapse[ k ] = k;
				if ( debug ) {
					console.error( 'collapseObjects.toCollapse:' + k );
				}
			}
		}

		self.walk( elo, function( key, value, type, path, parent ) {
			path = self.removeArrayIndexes( path, what );
			if ( !( path in toCollapse ) ) {
				return;
			}

			if ( debug ) {
				console.error( '-----------------------------------------------------------------------------' );
				console.error( '@' + path + ' has ' + value.length + ' elements' );
				console.error( 'old: ' + JSON.stringify( value ).substr(0,99) );
			}

			let nu = {};
			for ( let i = 0 ; i < value.length ; i++ ) {
				let e = value[ i ];
				for (let k in e ) {
					let v = e[ k ];

					

					//k += '<C.OBJECT_ARRAY_E>';
					if ( k in nu ) {
						if ( 'array' === self.myType( nu[ k ] ).major ) {
							nu[ k ].push( v );
						} else {
							nu[ k ] = [ nu[ k ], v ];
						}
					} else {
						nu[ k ] = v;
					}
				}
			}

			parent[ key ] = nu;
			collapsed++;
			//return true;
		});

		console.error( 'I collapsed ' + collapsed + ' object arrays' );
		return collapsed;
	};

	/////////////////////////////////////////////////////////////////////////////

	self.walk = function( top, handler ) {
		return self._walk( null, top, '', null, handler );
	}

	self._walk = function( key, value, path, parent, handler ) {
		let type = self.myType( value );
		if ( handler( key, value, type, path, parent ) ) {
			return;
		}

		if ( 'array' === type.major ) {
			path += '/_';
		}

		for ( let k in value ) {
			let v = value[ k ];
			let p = path + '/' + k;

			let type = self.myType( v );
			switch( type.major ) {
				case 'array':  
				case 'object': self._walk( k, v, p, value, handler );
				default: handler( k, v, type, p, value ); 
			}
		}
		return value;
	};

	self.removeArrayIndexes = function( path, what ) {
		if ( !path ) return path; // root is annoying..
		what = self.isUndefined( what ) ? '' : what;
		return path.replace( new RegExp( '/_/[0-9]+', 'g' ), what );
	};

	///// lazy copy/pasta

	// structure like: x: [ {a:1}, {b:2}, {c:3} ];
	self.isFlatArray = function( elo ) {
		// TODO: array where every value is an object with a single key / value pair
		for( let i = 0 ; i < elo.length ; i++ ) {
			let v = elo[ i ];
			if ( !self.isObject( v ) ) return false;
			let keys = Object.keys( v );
			if ( 1 != keys.length ) return false;

			let key = keys[ 0 ];
			let value = v[ key ];

			if ( self.isObject( value ) ) return false;
		}
		return true;
	};

	// structure like: x: [ {a:1}, {b:2}, {c:3} ];
	self.flattenArray = function( elo ) {
		let nu = {};
		for( let i = 0 ; i < elo.length ; i++ ) {
			let oldObject = elo[ i ];
			let key = Object.keys( oldObject );
			let value = oldObject[ key ];

			if ( key in nu ) {
				let previous = nu[ key ];
				if ( Array.isArray( previous ) ) {
					previous.push( value );
				} else {
					nu[ key ] = [ previous, value ];
				}
			} else {
				nu[ key ] = value;
			}
		};

		return nu;
	};

	// is the string actually a numeric value?
	self.isNumber = function( v ) {
		if ( !isNaN( v ) ) return v;
		let tmp = parseFloat( v );
		if ( v == ( '' + tmp ) ) return tmp;

		tmp = parseInt( v );
		if ( v == ( '' + tmp ) ) return tmp;
		return false;
	};

	self.isJunkValue = function( v ) {
		return ( false
			|| self.isUndefined( v )
			|| ( '' === v )
			|| ( self.isObject( v ) && 0 == Object.keys( v ).length ) 
			|| ( Array.isArray( v ) && 0 == v.length )
		);
	}

	self.isString = function( s ) {
		return ( 'string' === typeof( s ) || s instanceof String );
	};

	self.isBetterAsArray = function( o, parentKey ) {
		if ( !self.isObject( o ) || self.isString( o ) ) {
			return false;
		}

		let keys = Object.keys( o );

		for ( let i = 0 ; i < keys.length ; i++ ) {
			let key = keys[ i ];
			let n = parseInt( key );
			if ( key !== '' + n ) return false;
			keys[ i ] = n;
		}

		return true; // allow gaps?

		keys.sort((a,b)=>a-b);

		let a = keys[ 0 ];
		for ( let i = 1 ; i < keys.length ; i++ ) {
			let b = keys[ i ];
			if ( 1 != b - a ) return false;
			a = b;
		}
		return true;
	}

	self.isShallow = function( o ) {
		if ( !self.isObject( o ) || Array.isArray( o ) ) return;

		self.log( ' shallow? ' + Object.keys( o ) );
		if ( 1 != Object.keys( o ).length ) return false;
		for ( let k in o ) {
			let v = o[ k ];
			if ( Array.isArray( v ) && v.length == 1 ) return true;
			if ( self.isObject( v ) ) {
				if ( !self.isShallow( v ) ) return false;
			}
			// string or number or some such...
			return true;
		}
		return true;
	};

	self.isObject = function( o ) {
		return 'object' === typeof( o );
	};

	self.isUndefined = function( o ) {
		return 'undefined' === typeof( o );
	};

	// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
	self.myType = function( value, shallow, tmi ) {
		let type = {
			  major:false
			, minor:false
			, subType:false
			, toString:function(){ 
				return this.major + '.' + this.minor + ( this.subType ? ( '(' + this.subType + ')' ) : '' )
			}
			, is:function( major, minor ) { return this.major === major && this.minor === minor }
		};

		if ( self.isUndefined( value ) ) {
			type.major = 'undefined';
		}

		if ( !type.major && self.isString( value ) ) {
			type.major = 'string';
			type.numerical = self.isNumber( value );	
			type.minor = type.numerical ? 'number' : 'string'
		}

		if ( !type.major && Array.isArray( value ) ) {
			type.major = 'array';
			type.count = value.length;
			type.minor = self.countType( value.length );
			if ( value.length > 1 ) {
				let seen = {};
				let uSimp = true;
				for ( let i = 0 ; i < value.length && uSimp ; i++ ) {
					let sv = value[ i ];
					let svType = self.myType( sv, true );
					if ( 'object' != svType.major ) {
						uSimp = false;
						break;
					}
					for ( let sk in sv ) {
						if ( sk in seen ) {
							uSimp = false;
							break;
						}
						seen[ sk ] = true;
					}
				}
				if ( uSimp ) {
					type.minor += '-singlo';
				}
			}
			if ( !shallow ) {
				type.subType = self.subTypical( value );
			}
		}

		if ( !type.major ) {
			type.major = typeof( value )
			if ( 'bigint' == type || 'number' === type ) {
				type.major = 'number';
				// this is a terrible test, but a lot of them fail for case like 33.0
				type.minor = ( -1 == ( '' + value ) .indexOf( '.' ) ) ? 'integer' : 'float';
			}
		   
			if ( 'object' === type.major ) {
				let keys = Object.keys( value );
				type.count = keys.length;
				type.minor = self.countType( keys.length );
				if ( !shallow ) {
					type.subType = self.subTypical( value );
				}
			}
			// could still be: boolean, symbol or function
		}
		
		return type;
	};

	self.subTypical = function( container ) {
		let subType = false;
		for ( let k in container ) {
			let next = self.myType( container[ k ] );
			if ( subType != next && subType !== false ) {
				subType = 'mixed';
				break;
			}
			subType = next;
		}
		return subType;
	};

	self.countType = function( n ) {
		switch( n ) {
			case 0: return 'empty'; 
			case 1: return 'single';
		}
		return 'multiple';
	};


	/////////////////////////////////////////////////////////////////////////////

	// more utility mess

	self.pad = function( s, count, fill ) {
		return self.rightPad( s, count, fill );
	}
	self.rightPad = function( s, count, fill ) {
		count = self.isUndefined( count ) ? 33 : count;
		fill = self.isUndefined( fill ) ? ' ' : fill;
		while ( s.length < count ) s += ' ';
		return s;
	};
	self.leftPad = function( s, count, fill ) {
		count = self.isUndefined( count ) ? 33 : count;
		fill = self.isUndefined( fill ) ? ' ' : fill;
		while ( s.length < count ) s = ' ' + s;
		return s;
	};

	self.addValue = function( bucket, key, value ) {
		self.addToObject( self.getSubject( bucket, key ), value );
	}

	self.getSubject = function( values, value ) {
		return value in values ? values[ value ] : ( values[ value ] = {} );
	};

	self.addToObject = function( values, value, increment ) {
		increment = self.isUndefined( increment ) ? 1 : increment;
		values[ value ] = ( value in values ) ? values[ value ] + increment : increment;
	};
};

new weakSauxer().main( process.argv.slice( 2 ) );
