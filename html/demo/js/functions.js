const fullscreen = function( element ) {
	var fz = 'webkitRequestFullscreen requestFullScreen mozRequestFullScreen msRequestFullscreen webkitRequestFullscreen webkitRequestFullscreen'.split( ' ' );

	for ( var i = 0 ; i < fz.length ; i++ ) {
		var f = fz[ i ];
		if ( f in element ) {
			element[ f ]();
			break;
		}
	}
};

const frame = function( drawCallback, fps ) {
	fps = fps || 24;

	var frameFunction = function() {};
	frameFunction.count = 0;
	frameFunction.timeOut = false;

	frameFunction.start = function() {
		frameFunction.count++;
		drawCallback();

		frameFunction.timeOut = setTimeout(
			function() {
				requestAnimationFrame( frameFunction.start );
			}
			, 1000 / fps
		);
	};

	frameFunction.stop = function() {
		if ( frameFunction.timeOut ) {
			clearTimeout( frameFunction.timeOut );
			frameFunction.timeOut = false;
		}
	};

	return frameFunction;
};

const getByTag = function( tag ) {
	return document.getElementsByTagName( 'canvas' )[ 0 ];
};

const getById = function( id ) {
	return document.getElementById( id );
};

const makeElement = function( stuff ) {
	stuff.type = stuff.type || 'div';
	var element = document.createElement( stuff.type );
	for ( var k in stuff ) {
		if ( /^(kids|type)$/.test( k ) ) continue;
		switch ( k ) {
			case 'txt': element.appendChild( document.createTextNode( stuff[ k ] ) ); break;
			default: element.setAttribute( k, stuff[ k ] );
		}
	}
	if ( 'kids' in stuff ) {
		for ( var i = 0 ; i < stuff.kids.length ; i++ ) {
			element.appendChild( makeElement( stuff.kids[ i ] ) );
		}
	}
	return element;
};
