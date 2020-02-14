#!/usr/bin/env node 

const fs = require( 'fs' );

/**
 *
 * It's no joke, but maybe I should see a professional, cuz 2020, I'm trying
 * to shallow parse XML like a lunatic o.O
 *
 * 
 *
 */
const weakSauxer = function() {
	const self = this;

	self.main = function( args ) {
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
			if ( debug ) console.log( '<| ' + line );

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

			if ( debug ) console.log( '>| ' + d );
			if ( debug ) console.log( '-----------------------------------------------------------------------------' );
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
	
	self.scrub = function( elo ) {
		self.anyNumber( elo );
		self.collapseArrays( elo );
		console.log( JSON.stringify( elo, false, '\t' ) );
	};


	self.anyNumber = function( elo ) {
		self.walk( elo, function( key, value, type, context, path ) {
			// TODO: might need / want to do this based on path...
			if ( type.is( 'string', 'number' ) ) {
				// somehow, type.numerical is a string again???
				context[ key ] = parseFloat( value );
			}
		});
	}

	// cuz my conversion makes so many spurius arrays... 
	// the first order of business is to elimate them
	self.collapseArrays = function( elo ) {
		let collapsed = 0;

		let allArrays = {};
		let aTypes = {};

		self.walk( elo, function( key, value, type, context, path ) {
			if ( 'array' !== type.major ) return;
			path = self.removeArrayIndexes( path );
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
			//console.log( self.pad( path, 77 ) + ' -> ' + type + ' cuz ' + JSON.stringify( counts ) );
			collapseable[ path ] = type;
		}

		//console.log( JSON.stringify( collapseable, false, '\t' ) );

		self.walk( elo, function( key, value, type, context, path ) {
			if ( 'array' !== type.major ) return;
			path = self.removeArrayIndexes( path );
			if ( !( path in collapseable ) ) return;
			let collapseType = collapseable[ path ];

			if ( 'empty' == collapseType ) {
				//console.log( 'e> ' + path + ': ' + JSON.stringify( context, false, '\t' ) );
				// this is a little nuts...
				delete context[ key ];
				context[ key + '<C.E>' ] = '<<EMPTY>>';
				collapsed++;
				return;
			}

			if( 'single' == collapseType ) {
				delete context[ key ];
				context[ key + '<C.S>' ] = value[ 0 ];
				collapsed++;
				return;
			}

			if ( 'string.string' == collapseType ) {
				delete context[ key ];
				context[ key + '<C.Z>' ] = value.length ? value[ 0 ] : '<<EMPTY_STRING>>';
				collapsed++;
				return;
			}



		});

		console.log( 'I collapsed ' + collapsed + ' arrays' );
		return collapsed;
	};

	self.walk = function( current, handler, path ) {
		path = self.isUndefined( path ) ? '' : path;

		for ( let key in current ) {
			let value = current[ key ];
			let type = self.myType( value );

			let p = path + '/' + key;

			if ( handler( key, value, type, current, p ) ) {
				return;
			}

			if ( 'array' === type.major ) {
				self.walk( value, handler, p + '/_' );
			}
			if ( 'object' === type.major ) {
				self.walk( value, handler, p );
			}
		}
	};

	self.removeArrayIndexes = function( path ) {
		return path.replace( new RegExp( '/_/[0-9]+', 'g' ), '' );
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
	self.myType = function( value ) {
		let type = {
			  major:false
			, minor:false
			, toString:function(){ return this.major + '.' + this.minor }
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
				// TODO: if multiple, see if all the keys are numeric and sequential... might be a jacked up "array"
			}
			// could still be: boolean, symbol or function
		}
		
		return type;
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

	self.getSubject = function( values, value ) {
		return value in values ? values[ value ] : ( values[ value ] = {} );
	};

	self.addToObject = function( values, value, increment ) {
		increment = self.isUndefined( increment ) ? 1 : increment;
		values[ value ] = ( value in values ) ? values[ value ] + increment : increment;
	};
};

new weakSauxer().main( process.argv.slice( 2 ) );
