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

	self.main = function( args ) {
		fs.readFile( args[ 0 ], 'utf-8', (e,d)=>{if(e)throw e;self.ware(JSON.parse(d))} );
	};

	/////////////////////////////////////////////////////////////////////////////

	self.ware = function( elo ) {
		self.keyedUp( elo );
		self.blockHeaded( elo );

		// TODO: more good stuff

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

	self.debug = function() {
		let s = arguments[ 0 ];
		for ( let i = 1 ; i < arguments.length ; i++ ) {
			s = s.replace( /%/, arguments[ i ] );
		}
		console.error( s );
	};

};

new relma_magicaroni().main( process.argv.slice( 2 ) );
