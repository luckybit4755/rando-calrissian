#!/usr/bin/env node 

const fs = require( 'fs' );

/**
 *
 * It's no joke, but maybe I should see a professional, cuz 2020, I'm trying
 * to shallow parse XML like a lunatic o.O
 *
 *
 */
const weakSauxer = function() {
	const self = this;

	self.main = function( args ) {
		fs.readFile( args[ 0 ], 'utf-8', self.read );
	};

	self.read = function( e, d ) {
		if ( e ) throw e;

		let xml = self.simplify( d );
		fs.writeFile( 'ugly.xml', xml ,(e,d)=>{if(e) throw e});

		let json = self.toJson( xml );
		fs.writeFile( 'ugly.json', json, (e,d)=>{if(e) throw e});

		// moment of truth
		let verified = JSON.parse( json );
		json = JSON.stringify( verified, false, '\t' );
		fs.writeFile( 'ugli.json', json, (e,d)=>{if(e) throw e});
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
};

new weakSauxer().main( process.argv.slice( 2 ) );
