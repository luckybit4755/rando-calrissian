//#!/usr/bin/env node 

const fs = require('fs');
const xml2json = require('xml2json'); // npm install xml2json

const xmlJsonomnom = function() {
	const self = this;
	self.debug = !true;

	// turn objects into arrays whenever possible even
	// if this is not consistent throughout the object
	self.aggressiveArrays = true;

	self.main = function( args ) {
        fs.readFile(args[ 0 ], 'utf-8', (e,d)=>self.parseFile(e,d) );
    };

    self.parseFile = function( e, xml ) {
        if ( e ) throw e;

		let original = JSON.parse( xml2json.toJson( xml ) );

		let steps = [
			, self.specialCase
			, self.nomnomnom
			, self.deNullIt
			, self.flatIron
			, self.arrayIt
		];

		let now = original;
		for ( let i = 0 ; i < steps.length ; i++ ) {
			let step = steps[ i ];
			if ( step ) {
				now = step( now );
			}
		}
		console.log( JSON.stringify( now , false , '\t' ) );
    };

	/////////////////////////////////////////////////////////////////////////////

	self.specialCase = function( elo ) {
		if ( !self.isObject( elo ) || self.isString( elo ) ) return elo;

		for ( let k in elo ) {
			let v = elo[ k ];

			switch( k ) {
				case 'AttributeBlock':
					v = self.special_AttributeBlock( v );
					break;
			}

			let ko = k;

			if ( ko !== k ) {
				delete elo[ k ];
			}
			elo[ ko ] = self.specialCase( v );

		}
		return elo;
	};

	self.special_AttributeBlock = function( v ) {
		if ( !Array.isArray( v ) ) {
			v = [ v ]; // whoa.... 
		} 
		let nu = {};
		for ( let i = 0 ; i < v.length ; i++ ) {
			let a = v[ i ];
			nu[ a.blockName ] = a; 
			delete a.blockName;
		}
		v = nu;
		return v;
	};

	self.addToThing = function( thing, key, value ) {
		if ( Array.isArray( thing ) ) {
			let o = {};
			o[ key ] = value;
			thing.push( o );
		} else {
			if ( self.isObject( thing ) ) {
				if ( key in thing ) throw key + ' is already in attribute';
				thing[ key ] = value;
			} 
		}
	}

	/////////////////////////////////////////////////////////////////////////////


	self.nomnomnom = function( elo ) {
		self.log( '> self.nomnomnom ' );
		if ( !self.isObject( elo ) ) {
			return elo;
		}

		self.log( Object.keys( elo ).slice( 0, 33) + ' is ' + typeof( elo ) + ' and isArray:' + Array.isArray( elo ) );

		if ( Array.isArray( elo ) ) {
			return self.nomArray( elo );
		}
		return self.nomObject( elo );
	};

	self.nomArray = function( elo ) {
		self.log( '> self.nomArray:' );
		//self.out( elo[ 0 ] );

		if( self.isFlatArray( elo ) ) {
			self.log( 'congrats! it\'s a flat array structure!' );
			return self.flattenArray( elo );
		}

		let nu = [];
		for( let i = 0 ; i < elo.length ; i++ ) {
			nu.push( self.nomnomnom( elo[ i ] ) );
		}

		return nu;
	};

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

		return self.nomObject( nu );
	};

	self.nomObject = function( elo ) {
		self.log( '> self.nomObject:' + Object.keys( elo ).slice( 0, 33 ) );

		let nu = {};

		let nested = {};

		for ( let k in elo ) {
			let value = elo[ k ];

			let nestling = /_[0-9]+_/.test( k );
			if ( !nestling ) {
				self.log( 'terminate in ' + k );
				nu[ k ] = self.nomnomnom( value );
				continue;
			}

			self.log( '-----------------------------------------------------------------------------' );
			self.log( 'nesting with ' + k );
			self.log( '> nest is ' + self.s( nested ) );
			self.log( '-----------------' );

			let the_nest = nested;
			let k_parts = k.split( '_' );

			// just add all the keys
			for ( let i = 0 ; i < k_parts.length ; i++ ) {
				let k_part = k_parts[ i ];
				if ( k_part in the_nest ) {
					self.log( 'key ' + k_part + ' is in the nest ' );
					the_nest = the_nest[ k_part ];
				} else {
					self.log( 'add ' + k_part + ' to the nest ' );
					the_nest = the_nest[ k_part ] = {};
					self.out( nested );
				}
			}
		}

		if ( Object.keys( nested ).length ) {
			self.log( 'hump hump hump: ' );
			self.out( nested );
			self.log( 'shallow:' + self.isShallow( nested ) );

			if ( self.isShallow( nested ) ) {
				let flat = self.flattenObject( nested );
				flat.k = flat.k.replace( /^_/, '' );
				self.log( 'this flat thing: ' + flat.k + ' -> ' + flat.v );
				nu[ flat.k ] = flat.v;
			} else {

				self.log( 'nest-tastic!' );
				self.out( nested );
				self.deNest( nested, elo );
				self.out( nested );

				for ( let k in nested ) {
					let v = nested[ k ];
					if ( k in nu ) {
						if ( Array.isArray( nu[ k ] ) ) {
							nu[ k ].push( v );
						} else {
							nu[ k ] = [ nu[ k ], v ];
						}
					} else {
						nu[ k ] = v;
					}
					if ( self.isShallow( nu[ k ] ) ) {
						delete nu[ k ]; // naw...
					}
				}
			}
			self.log( '-------------------' );
		}

		return nu;
	};

	self.deNest = function( nested, elo, path ) {
		path = self.isUndefined( path ) ? '' : path;
		for( let k in nested ) {
			let v = nested[ k ];
			let here = ( path + '_' + k ).replace( /^_/, '' );

			let emptyObject = self.isObject( v ) && 0 == Object.keys( v );
			if ( emptyObject ) {
				v = elo[ here ];
				// not sure this goes here.. 
				switch ( k ) {
					case 'xy':
						nested[ 'at' ] = self.grossXY( v );
						delete nested[ k ];
						break;
					case 'arc':
						v = self.grossXY( v );
					default:
						nested[ k ] = v;
				}
			} else {
				self.deNest( v, elo, here );
			}
		}
	};

	self.ish = function( v ) {
		let p = 10000;
		return Math.floor( p * v ) / p;
	};

	self.grossXY = function( xy ) {
		let nz = xy.split(',').map( v => parseFloat( v ) );
		let x = nz[ 0 ];
		let y = nz[ 1 ];

		let fx = x / 100 - 0.5;
		let fy = y / 100 - 0.5;
		let length = Math.sqrt( ( fx * fx ) + ( fy * fy ) );
		let angle = Math.atan2( -fy, fx );

		return { x:x, y:y, length:self.ish( length ), angle:self.ish( angle ) };
	}

	self.flattenObject = function( o, delim, soFar ) {
		delim = self.isUndefined( delim ) ? '_' : delim;
		soFar = self.isUndefined( soFar ) ? {k:'',v:false}  : soFar;

		self.log( 'flattenObject:' + soFar.k );

		for ( let k in o ) {
			soFar.k += delim + k;
			let v = o[ k ];
			if ( self.isObject( v ) ) {
				return self.flattenObject( v, delim, soFar );
			}
			
			// string or number or some such...
			soFar.v = v;
		}

		return soFar;
	};

	self.isNumber = function( v ) {
		return !isNaN( v ) || v == ( '' + parseInt( v ) );
	};

	self.flatIron = function ( elo, parentKey ) {
		let nu = {};

		let keys =  Object.keys( elo );
		let firstKey   = keys[ 0 ];
		let firstValue = elo[ firstKey ];

		// for objects with a single value...
		if ( 1 == keys.length && !self.isNumber( firstValue ) ) {
			elo = elo[ firstKey ];
		}

		for( let k in elo ) {
			let v = elo[ k ];

			if ( self.isObject( v ) ) {

				// gross special case here for numeric keys :-(
				if ( self.isShallow( v ) && !self.isNumber( k ) ) {
					let flat = self.flattenObject( v );
					flat.k = k + flat.k; // + '_'; // mark these as wack
					nu[ flat.k ] = flat.v;
					continue;
				}

				nu[ k ] = self.flatIron( v, k );
			} else {
				nu[ k ] = v;
			}
		}

		return nu;
	};

	/////////////////////////////////////////////////////////////////////////////
		
	self.deNullIt = function( elo ) {
		for ( let k in elo ) {
			let v = elo[ k ];
			if ( self.isJunkValue( v ) ) {
				delete elo[ k ];
			} else {
				if ( self.isObject( v ) ) {
					self.deNullIt( v );
				}
			}
		}
		return elo;
	};

	self.isJunkValue = function( v ) {
		return ( false
			|| ( '' === v )
			|| ( self.isObject( v ) && 0 == Object.keys( v ).length ) 
		);
	}

	/////////////////////////////////////////////////////////////////////////////

	self.arrayIt = function( elo ) {
		let tracker = {};
		self.arrayHunter( elo, tracker );

		let wanted = {};
		for ( let k in tracker ) {
			let v = tracker[ k ];

			let vz = {true:0,false:0};
			for ( let i = 0 ; i < v.length ; i++ ) vz[ v[ i ] ]++;

			let gut = ( 0 != vz[ true ] ) && ( 0 == vz[ false ] );
			if ( gut ) wanted[ k ] = true;
		}

		console.log( 'wanted:' + Object.keys( wanted ) );
		
		return self.arrayEm( elo, wanted );
	};

	self.arrayEm = function( elo, wanted, bt ) {
		if ( !self.isObject( elo ) || self.isString( elo ) ) return elo;

		bt = self.isUndefined( bt ) ? '' : bt;

		for ( let k in elo ) {
			//console.log( 'x>' + bt + '.' + k );

			let v = elo[ k ];

			let niceArray = ( k in wanted );

			if ( self.aggressiveArrays ) {
				niceArray = self.isBetterAsArray( v, k );
			}

			if ( niceArray && !self.isString( v ) ) {
				let nu = [];
				for ( let kk in v ) {
					let nn = parseInt( kk );
					let vv = v[ kk ];
					nu[ nn ] = self.arrayEm( vv, wanted, bt + '.' + kk );
				}
				delete elo[ k ];
				elo[ k ] = nu;
			} else {
				elo[ k ] = self.arrayEm( v, wanted, bt + '.' + k );
			}
		}
		return elo;
	};

	self.arrayHunter = function( elo, tracker, path ) {
		if ( !self.isObject( elo ) ) return;

		path = self.isUndefined( path ) ? '/' : path;

		for ( let k in elo ) {
			let v = elo[ k ];

			let nicer = self.isBetterAsArray( v, k );

			if ( false ) {
				if ( nicer ) {
					console.log( 'NR: yesu:' + path );
				} else {
					if ( self.isObject( v ) ) {
						console.log( 'NR: notu:' + path + ' : ' + Object.keys( v ) );
					} // otherwise trivial junk...
				}
			}

			// trying to make this per path was full of fail :-(
			let toTrack = !true ? path : k;
			if ( !( k in tracker ) ) tracker[ toTrack ] = [];
			tracker[ toTrack ].push( nicer );

			let p = self.isNumber( k ) ? '.' : k;

			self.arrayHunter( v, tracker, path + p + '/'  );
		}
	};

	self.isString = function( s ) {
		return 'string' === typeof( s );
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

	self.s = function( o ) {
		return self.toString( o );
	};

	self.toString = function( o ) {
		return JSON.stringify( o, false, '\t' );
	};

	self.out = function( o ) {
		self.log( self.toString( o ) ) ;
	};

	self.log = function( s ) {
		if ( self.debug ) console.log( s );
	}
};

new xmlJsonomnom().main( process.argv.slice( 2 ) );
