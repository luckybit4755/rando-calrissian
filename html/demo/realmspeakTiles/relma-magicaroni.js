#!/usr/bin/env node 

const relma_magicaroni = function() {
	const self = this;

	self.main = function( args ) {
		console.log( 'hello relma_magicaroni' );
	};
};

new relma_magicaroni().main( process.argv.slice( 2 ) );
