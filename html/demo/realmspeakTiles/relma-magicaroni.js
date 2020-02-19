#!/usr/bin/env node 

const fs = require( 'fs' );

/**
 *
 * Unlike weakSauxer.js, which attempts to be data agnostic, this uses 
 * observations about the data to try to do "cleanup";
 *
 *
 *
 *
 */
const relma_magicaroni = function() {
	const self = this;

	/////////////////////////////////////////////////////////////////////////////

	self.main = function( args ) {
		fs.readFile( args[ 0 ], 'utf-8', (e,d)=>{if(e)throw e;self.ware(JSON.parse(d))} );
	};

	/////////////////////////////////////////////////////////////////////////////

	self.ware = function( elo ) {
		self.keyedUp( elo );
		self.blockHeaded( elo );
		self.containsId( elo );
		self.GameObject( elo );
		self.nicerValues( elo );
		self.featherTheNest( elo );
		self.itsASetup( elo );

		console.log( self.z( elo ) ); // final victory
	};

	/*
	----------------------------------------------------------------
	{
	  'attributeList:keyName': 'target_clearing',
	  'attributeList:attributeVal:N0': 'monsters',
	  'attributeList:attributeVal:N1': 'spells',
	  'attributeList:attributeVal:N2': 'curses'
	}
	----------------------------------------------------------------
	{ "target_clearing": [ "monsters", "spells", "curses" ] }
	----------------------------------------------------------------
	*/
	self.keyedUp = function( elo ) {
		let count = 0;
		let key = 'attributeList:keyName';
		self.walk( elo, (node,path,ancestors) => {
			if ( !self.isObject( node ) || !( key in node ) ) return;
			let name = node[ key ];

			let nu = {};
			nu[ name ] = [];
			for ( let k in node ) { 
				if ( k === key ) continue;
				nu[ name ].push( node[ k ] );
			}

			// do the replacement inline...
			let target = self.last( ancestors, 2 );
			let index = self.last( path );
			target[ index ] = nu;
			count++;
		});
		this.debug( 'keyedUp % times', count );
	};

	/*
	----------------------------------------------------------------
    {
        "AttributeBlock": [
			{ "blockName":            "level_3"  },
			{ "attribute:name":       "Huntress" },
			{ "attribute:spellcount": "1"        }
		]
	}
	----------------------------------------------------------------
	{
		"level_3": {
			"attribute:name": "Huntress",
			"attribute:spellcount": "1"
		}
	}
	----------------------------------------------------------------
	*/
	self.blockHeaded = function( elo ) {
		let blockHeads = [];
		self.walk( elo, (node,path,ancestors) => {
			let last = self.last( path );

			if ( 'blockName' === last ) {
				let blockHead = self.last( ancestors, 4 );
				let blockKeys = Object.keys( blockHead );
				let isABlockHead = ( 1 == blockKeys.length && blockKeys[ 0 ] === 'AttributeBlock' );
				if ( !isABlockHead ) throw( 'faux blockhead detected: ' + path );
				blockHeads.push( {name:node, blockHead:blockHead} );
			}
		});

		this.debug( 'there are % blockHeads in need of correction...', blockHeads.length );
		for ( let i = 0 ; i < blockHeads.length ; i++ ) {
			let blockHead = blockHeads[ i ];
			
			let nu = {};
			for ( let j = 0 ; j < blockHead.blockHead.AttributeBlock.length ; j++ ) {
				let attribute = blockHead.blockHead.AttributeBlock[ j ];
				for ( let k in attribute ) {
					if ( 'blockName' === k ) continue;
					let v = attribute[ k ];
					if ( k in nu ) {
						throw( 'blockHead key collision is bad: ' + k + ' in ' + self.z( blockHead ) );
					} else {
						nu[ k ] = v;
					}
				}
			}
			blockHead.blockHead[ blockHead.name ] = nu;
			delete blockHead.blockHead.AttributeBlock;
		}
	};
		
	/*
	----------------------------------------------------------------
	[ {"contains:id": "1"}, {"contains:id": "2"},{"contains:id": "3"} ]
	----------------------------------------------------------------
	[ {"contains":[1,2,3]} ]
	----------------------------------------------------------------
	*/
	self.containsId = function( elo, debug ) {
		let hunt = 'contains:id';
		let toId = {};

		if ( debug ) {
			self.debug( '-----------' );
		}

		self.walk( elo, (id,path,ancestors) => {
			if ( hunt === self.last( path ) ) {
				let key = path.slice( 0, -2 ).join( '->' );
				if ( key in toId ) {
					return;
				}

				let target = self.last( ancestors, 4 );

				let toReplace = self.last( ancestors, 3 );
				let keyToReplace = self.last( path, 3 ); 

				if ( debug ) {
					self.debug( '====================================================' );
					self.debug( 'key is %', key );
					self.debug( 'toReplace is at % in %\n%', keyToReplace, key, self.z( target ) );
				}

				let ids = [];
				let replacement = Array.isArray( toReplace ) ? [] : {};
				for ( let k in toReplace ) {
					let v = toReplace[ k ];
					if ( hunt in v ) {
						ids.push( parseInt( v[ hunt ] ) );
					} else {
						replacement[ k ] = v;
					}
				}

				if ( Array.isArray( toReplace ) ) { 
					replacement.push( {containsId:ids} );
				} else {
					replacement[ 'FIXME-contains-ids?' ] = {containsId:ids};
				}

				if ( debug ) {
					self.debug( 'the ids are %', ids );
					self.debug( 'replacement is\n%', replacement );
				}


				toId[ key ] = { target:target, key:keyToReplace, replacement:replacement, ids:ids };
			}
		})

		for ( let key in toId ) {
			let lul = toId[ key ];
			lul.target[ lul.key ] = lul.replacement;
		}

		self.debug( 'containsId modified % instances', Object.keys( toId ).length );
	};

	// remove a useless layer of abstraction
	self.GameObject = function( elo ) {
		let nu = [];
		let gameObjectsKey = 'game:objects';
		let gameObjects = elo[ gameObjectsKey ];

		for ( let i = 0 ; i < gameObjects.length ; i++ ) {
			let gameObject = gameObjects[ i ].GameObject;
			let nn = {};

			for ( let j in gameObject ) {
				let o = gameObject[ j ];
				if ( 1 != Object.keys( o ).length ) {
					throw 'GameObject at ' + i + ',' + j + ' has multiple keys: ' + self.z( gameObject[ j ] );
				}
				for ( let k in o ) {
					if ( k in nn ) {
						throw 'GameObject at ' + i + ' has duplicate keys: ' + self.z( gameObject );
					} 
					nn[ k ] = o[ k ];
				}
			}
	
			// fun, huh? offset matches id	
			if ( i != nn.id ) {
				throw 'GameObject at ' + i + ' does not match id ' + nn.id;
			}	

			nu.push( nn );
		}
 
		elo[ gameObjectsKey ] = nu;
	}

	self.nicerValues = function( elo ) {
		/*
			think these are supposed to be like flags 
					"attribute:missile": "<<EMPTY_STRING>>",
					"attribute:rw_expansion_1": "<<EMPTY>>",
					"attribute:denizen": "<<EMPTY>>"
		*/
		self.walk( elo, (value,path,ancestors) => {
			if ( !self.isString( value ) ) return;

			let target = self.last( ancestors, 2 );
			let key = self.last( path );

			if ( /^<<EMPTY/.test( value ) ) return target[ key ] = true;
			if ( /^[0-9]+$/.test( value ) ) return target[ key ] = parseInt( value );
			if ( /^clearing_[0-9]+$/.test( value ) ) target[ key ] = parseInt( value.replace( /.*_/, '' ) );
			if ( /_xy$/.test( key ) && /,/.test( value ) ) return target[ key ] = self.parseXY( value, true );
			if ( /_arc$/.test( key ) && /,/.test( value ) ) return target[ key ] = self.parseXY( value, true );
		});

		// and keys....

		// attribute:x -> x
		self.walk( elo, (value,path,ancestors) => {
			if ( !self.isObject( value ) || Array.isArray( value ) ) return;
			let keys = Object.keys( value );
			if ( !keys.some( v=>/^attribute:/.test(v) ) ) return;

			let atLess = keys.map( v=>v.replace( /^attribute:/, '' ) );
			if ( !self.isUniqueArray( atLess ) ) {
				throw 'oh, slap! attribute:.* collision' + key;
			}

			// an extra check for leaf nodes might be smart...

			let target = self.last( ancestors, 1 );
			for ( let key in target ) {
				let nuKey = key.replace( /^attribute:/, '' );
				if ( nuKey !== key ) {
					target[ nuKey ] = target[ key ];
					delete target[ key ];
				}
			}
		});

		// rename some keys for nesting later
		self.walk( elo, (value,path,ancestors) => {
			let key = self.last( path, 1 );
			if ( !( key in self.rename ) ) return;
			let target = self.last( ancestors, 2 );
			target[ self.rename[ key ] ] = target[ key ];
			delete target[ key ];
		});


		//self.rename
	};

    self.nestTest = function( k ) {
        return ( false
            || /_[0-9]+_/.test( k ) 
            || /^icon_/.test( k )
            || /^speed_/.test( k )
            || /^(level|optional)_[0-9]/.test( k )
			|| /^(add|create|distribute|extract|move):/.test( k )
        );
    };

	self.featherTheNest = function( elo ) {
		let feathers = {};
		self.walk( elo, (value,path,ancestors) => {
			let key = self.last( path, 1 );
			if ( !self.nestTest( key ) ) return;

			let featherKey = path.slice( 0, -1 ).join( ' -> ' );
			let target = self.last( ancestors, 2 );

			feathers[ featherKey ] = target;
		});

		for( let featherKey in feathers ) {
			let target = feathers[ featherKey ];

			//self.debug( '-----------------------------------------------------------------------------' );

			let nest = {};

			for ( let key in target ) {
				if ( !self.nestTest( key ) ) continue;

				let value = target[ key ];

				let current = nest;
				let delim = ( -1 == key.indexOf( ':' ) ? '_' : ':' );
				let keys = key.split( delim );

				//self.debug( '% -> %', key, value );
				for( let i = 0 ; i < keys.length ; i++ ) {
					let k = keys[ i ];

					//self.debug( '-- 1 % and % -> %', k, current, self.s( nest ) );
					if ( k in current ) {
						current = current[ k ];
						if ( !self.isObject( current ) ) {
							throw 'ouch! not such a nice nest! ' + key + ' in ' + self.z( target );
						}
					} else {
						current = current[ k ] = ( i == keys.length - 1 ) ? value : {};
					}
					//self.debug( '-- 2 % and % -> %', k, current, self.s( nest ) );
				}
				//self.debug( 'little nest is %', nest );

				delete target[ key ];
			}
			//self.debug( 'nest is %', nest );

			for ( let key in nest ) {
				if ( key in target ) {
					throw 'nesting disasters abound! so sorry! ' + key + ' is already in ' + self.z( target );
				}
				target[ key ] = nest[ key ];
			}
		}
	};

	self.itsASetup = function( elo ) {
		let setups = {};
		for ( let i = 0 ; i < elo.setups.length ; i++ ) {
			let name = false;
			let tasks = [];

			let setup = elo.setups[ i ].GameSetup;
			for ( let j = 0 ; j < setup.length ; j++ ) {
				let task = setup[ j ];
				if ( 'name' in task ) {
					name = task.name;
				} else {
					if ( 'create' in task ) {
						if ( 1 != Object.keys( task ).length ) {
							throw 'strange create task: ' + self.z( task );
						}
						if ( !( 'newPool' in task.create ) || 1 != Object.keys( task.create ).length ) {
							throw 'weird create task: ' + self.z( task );
						}

						task = {createPool:task.create.newPool};
					}
					tasks.push( task );
				}
			}

			if ( !name ) {
				throw 'setup has no name ' + self.z( setup );
			}

			setups[ name ] = tasks;
		}	

		elo.setups = setups;
	}

	/////////////////////////////////////////////////////////////////////////////

	self.walk = function( node, callback, path, ancestors ) {
		if ( self.isUndefined( path ) ) path = [];
		if ( self.isUndefined( ancestors ) ) ancestors = [node];
		
		if ( callback( node, path, ancestors ) ) {
			return;
		}

		if ( !self.isObject( node ) ) return;

		for ( let k in node ) {
			let v = node[ k ];
			let p = self.pathetic( path, k );
			let a = self.pathetic( ancestors, v );
			self.walk( v, callback, p, a );
		}
	};

	/////////////////////////////////////////////////////////////////////////////

	self.pathetic = function( path, key ) {
		let p = path.slice();
		p.push( key );
		return p;
	};

	self.last = function( path, past ) {
		if ( self.isUndefined( past ) ) past = 1;
		return path[ path.length - past ];
	};

	self.isObject = function( v ) {
		return 'object' == typeof( v );
	};

	self.isUndefined = function( v ) {
		return 'undefined' == typeof( v );
	};

	self.isString = function( s ) {
		return ( 'string' === typeof( s ) || s instanceof String );
	};


	self.z = function( elo ) {
		return JSON.stringify( elo, false, '\t' );
	};

	self.s = function( elo ) {
		return JSON.stringify( elo );
	};

	self.line = function( min ) {
		min = self.isUndefined( min ) ? 44 : min;
		let s = '-';
		while ( s.length <  min ) s += s;
		console.log( s );
	};

	// from xmlJsonomnom.grossXY
	self.parseXY = function( xy, polarIbarelyKnowar ) {
		let nz = xy.split(',').map( v => parseFloat( v ) );
		let x = nz[ 0 ];
		let y = nz[ 1 ];

		let point = {x:x,y:y};

		if ( polarIbarelyKnowar ) {
			let fx = x / 100 - 0.5;
			let fy = y / 100 - 0.5;
			point.length = self.ish( Math.sqrt( ( fx * fx ) + ( fy * fy ) ) );
			point.angle = self.ish( Math.atan2( -fy, fx ) );
		}

		return point;
	};

	self.isUniqueArray = function( a ) {
		let o = {};
		for ( let i = 0 ; i < a.length ; i++ ) {
			if ( a[ i ] in o ) return false;
			o[ a[ i ] ] = true;
		}
		return true;
	};

	// from xmlJsonomnom
	self.ish = function( v ) {
        let p = 10000;
        return Math.floor( p * v ) / p;
    };

	self.debug = function() {
		let s = arguments[ 0 ];
		for ( let i = 1 ; i < arguments.length ; i++ ) {
			let argument = arguments[ i ];
			let t = self.isObject( argument ) ? self.z( argument ) : argument.toString();
			s = s.replace( /%/, t );
		}
		console.error( s );
	};

	/////////////////////////////////////////////////////////////////////////////

	// put this big nasty list down here...
	self.rename = {
		// TODO: revisit these sometime ( see featherTheNest ) 
		  not_attack_speed          : 'speed_attack'
		, not_attack_speed_new      : 'speed_attack_new'
		, not_attack_speed_target   : 'speed_attack_target'
		, not_chit_speed            : 'speed_chit'
		, not_chit_speed_inc        : 'speed_chit_increase'
		, not_final_chit_speed      : 'speed_chit_final'
		, not_fly_speed             : 'speed_fly'
		, not_move_speed            : 'speed_move'
		, not_move_speed_change     : 'speed_move_change'
		// just for aesthetics
		, 'game:description'    : 'description'
		, 'game:file_version'   : 'version'
		, 'game:name'           : 'name'
		, 'game:objects'        : 'objects'
		, 'game:setups'         : 'setups'
		// gunna try these...
		, 'Move:count'              : 'move:count'
		, 'Move:from'               : 'move:from'
		, 'Move:to'                 : 'move:to'
		, 'Move:transferType'       : 'move:transferType'
		, 'Distribute:count'        : 'distribute:count'
		, 'Distribute:from'         : 'distribute:from'
		, 'Distribute:to'           : 'distribute:to'
		, 'Distribute:transferType' : 'distribute:transferType'
		, 'Create:newPool'          : 'create:newPool'
		, 'Extract:from'            : 'extract:from'
		, 'Extract:keyVals'         : 'extract:keyVals'
		, 'Extract:to'              : 'extract:to'
		, 'Add:count'               : 'add:count'
		, 'Add:from'                : 'add:from'
		, 'Add:targetObjectID'      : 'add:targetObjectID'
		, 'Add:transferType'        : 'add:transferType'
	};
	/////////////////////////////////////////////////////////////////////////////
};

/////////////////////////////////////////////////////////////////////////////
new relma_magicaroni().main( process.argv.slice( 2 ) );
/////////////////////////////////////////////////////////////////////////////
