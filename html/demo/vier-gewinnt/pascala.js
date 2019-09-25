const toString = function( v ) {
	return JSON.stringify( v );
};

const Odd = function( v ) {
	return v % 2;
};

// this is so crazy and gross
const convertArgumentsToArray = function() {
	let argz= [];
	arguments = arguments[ 0 ];
	for ( let key in arguments ) { 
		argz.push( arguments[ key ] );
	}
	return argz;
};

const makeArray = function() {
	return _makeArray( convertArgumentsToArray( arguments ) );
};

const _makeArray = function( argz ) {
	let theArray = []; // FIXME: this might be better as an object... 

	let value = argz[ 0 ];
	let start = argz[ 1 ];
	let stop  = argz[ 2 ];

	argz = argz.slice( 3 );

	// some of these don't start at 0 for some reason 
	for ( let i = 0 ; i < start ; i++ ) {
		theArray.push( '_' );
	}

	if ( 0 != argz.length ) {
		argz.unshift( value );
	}

	// FIXME: inclusive or exclusive?
	for ( let i = start ; i <= stop ; i++ ) {
		if ( 0 == argz.length ) {
			theArray[ i ] = value;
		} else {
			theArray[ i ] = _makeArray( argz );
		}
	}

	return theArray;
};

const makeString = function( count, fill ) {
	if ( !fill ) fill = '#';
	let value = '';
	for ( let i = 0 ; i < count ; i++ ) {
		value += fill;
	}
	return value;
};

const abs = function( v ) { 
	return Math.abs( v );
};

const Round = function( v ) { 
	return Math.round( v );
};

console.log( 'loaded pascala' );
