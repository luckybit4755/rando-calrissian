#!/usr/bin/env node 

const fs = require('fs');
const xml2json = require('xml2json'); // npm install xml2json

/**
 *
 * Parse https://raw.githubusercontent.com/dewkid/RealmSpeak/master/magic_realm/utility/components/resources/data/MagicRealmData.xml 
 * to pull the tile information out and convert it to JSON.
 *
 *
 */
const RealmspeakTiles = function() {
	const self = this;

	self.main = function( args ) {
		fs.readFile(args[ 0 ], 'utf-8', (e,d)=>self.parseFile(e,d) );
	};
	
	self.parseFile = function( e, xml ) {
		if ( e ) throw e;
		let tiles = self.findTiles( JSON.parse( xml2json.toJson( xml ) ) );
		console.log( JSON.stringify( tiles, false, '\t' ) );
	};

	self.findTiles = function( gameData ) {
		let tiles = {};
		let gameObjects = gameData.game.objects.GameObject;
		for ( let i = 0 ; i < gameObjects.length ; i++ ) {
			let tile = self.convertTile( gameObjects[ i ] );
			if ( !tile ) continue;

			tiles[ tile.name ] = tile;
			delete tile.name;
		}
		return tiles;
	};

	self.convertTile = function( gameObject ) {
		let attributes = self.getAttributes( gameObject );
		if ( !attributes || 'tiles' !== attributes.thiz.folder ) {
			return false;
		}

		let tile = { name:gameObject.name }

		tile.type = { m:"mountain", c:"cave", v:"valley", w:"woods" }[ attributes.thiz.tile_type.toLowerCase() ];
		let image = attributes.thiz.image;

		for ( let k in attributes ) {
			if ( 'thiz' === k ) continue;
			tile[ k ] = this.convertTileAttributes( image, k, attributes[ k ] );
		}

		if ( !true ) {
			tile.raw = attributes;
		}

		return tile;
	};

	self.getAttributes = function( gameObject ) {
		let attributes = {};
		for ( let i = 0 ; i < gameObject.AttributeBlock.length ; i++ ) {
			let attributeBlock = gameObject.AttributeBlock[ i ];
			let name = attributeBlock.blockName;
			if ( 'this' === name ) name = 'thiz';
			attributes[ name ] = {};
		}

		if ( 'enchanted.normal.thiz' !== Object.keys( attributes ).sort().join( '.' ) ) {
			return false;
		}

		for ( let i = 0 ; i < gameObject.AttributeBlock.length ; i++ ) {
			let attributeBlock = gameObject.AttributeBlock[ i ];
			let name = attributeBlock.blockName;
			if ( 'this' === name ) name = 'thiz';
			
			for ( let j = 0 ; j < attributeBlock.attribute.length ; j++ ) {
				let attribute = attributeBlock.attribute[ j ];
				for ( let k in attribute ) {
					let v = attribute[ k ];
					if ( 'string' === typeof( v ) && !v.length ) continue;
					attributes[ name ][ k ] = v;
				}
			}
		}
		return attributes;
	};

	self.convertTileAttributes = function( image, type, attributes ) {
		let tile = {};

		tile.image = './images/' + image + '-' + type + '.gif'; // gif?! lol! dfq?
		tile.offroad = self.toXY( attributes.offroad_xy );

		// really not sure what this is about...
		// tile.arcs = [];

		for ( let k in attributes ) {
			if ( 'offroad_xy' === k ) continue;

			let o = attributes[ k ];
			let v = o;
			if ( /_(xy|arc)$/.test( k ) ) v = self.toXY( v );

			if( 'normal' === v ) continue;

			let keySections = k.split( '_' );
			let what  = keySections[ 0 ] + 's';
			let index = parseInt( keySections[ 1 ] );
			let key   = keySections[ 2 ];

			if ( !( what in tile ) ) {
				tile[ what ] = {};
			}
			if ( !( index in tile[ what ] ) ) {
				tile[ what ][ index ] = {};
			}
			if ( key in tile[ what ][ index ] ) {
				throw( 'duplicate key error!' + JSON.stringify( tile ) );
			}

			// wat? skip this for now..
			if ( 'arc' === key ) {
				//console.log( 'butt:' + k + ' -> ' + o ); 
				continue;
			}

			tile[ what ][ index ][ key ] = v;
		}

		// separate paths from exits

		let exits = {};
		let paths = [];
		for( let k in tile.paths ) {
			let path = tile.paths[ k ];
			path.from = self.clearingToInteger( path.from );
			try {
				path.to = self.clearingToInteger( path.to );
				path.clearings = [ path.from, path.to ];
				delete path.to;
				delete path.from;

				paths.push( path )
			} catch( e ) {
				exits[ path.to ] = path.from;
			}
		}

		tile.paths = paths;
		tile.exits = exits;

		// simplify clearings
		tile.clearings = self.simplifyClearings( tile.clearings );

		return tile;
	};

	self.simplifyClearings = function( clearings ) {
		for ( let k in clearings ) {
			clearings[ k ] = clearings[ k ].xy;
		}
		return clearings;
	}

	self.clearingToInteger = function( c ) {
		if ( !( /^clearing_[0-9]+$/.test( c ) ) ) throw( c + ' does not match "clearing expression"' );
		return parseInt( c.replace( /.*_/, '' ) );
	}

	self.toXY = function( v ) {
		let vz = v.split( ',' ).map(v=>parseFloat(v));
		return {x:vz[0],y:vz[1]};
	}
};

new RealmspeakTiles().main( process.argv.slice( 2 ) );
