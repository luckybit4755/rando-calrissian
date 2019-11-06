#!/usr/bin/env node 

const fs = require( 'fs' );
const jpeg = require('jpeg-js');

/**
 *
 * npm install jpeg-js && ./JpgExample.js && open lol.jpg
 *
 *
 */
const JpgExample = function() {
	const self = this;

	self.main = function( args ) {
		var width = 320;
		var height = 180;
		var frameData = Buffer.alloc( width * height * 4 );
		var i = 0;
		while (i < frameData.length) {
			frameData[i++] = i % 256 // 0xFF; // red
			frameData[i++] = ( i + 33 ) % 256 // 0x00; // green
			frameData[i++] = ( i + 44 ) % 256 // 0x00; // blue
			frameData[i++] = 0xFF; // alpha - ignored in JPEGs
		}

		var rawImageData = { data:frameData, width:width, height:height };

		var quality = 50;
		var jpegImageData = jpeg.encode(rawImageData, quality );

		fs.writeFile( 'lol.jpg', jpegImageData.data, function(){} );
	};
};

new JpgExample().main( process.argv.slice( 2 ) );
