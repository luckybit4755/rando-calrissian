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
	drawCallback.frame = {count:0,timeOut:false};
	drawCallback.frame.count = 0;
	fps = fps || 24;

	var frameFunction = function() {
		this.start = function() {
			drawCallback.frame.count++;
			drawCallback();
			drawCallback.frame.timeOut = setTimeout(
				function() {
					requestAnimationFrame( frame );
				}
				, 1000 / fps
			);
		}

		this.stop = function() {
			if ( drawCallback.frame.timeOut ) {
				clearTimeout( drawCallback.frame.timeOut );
			}
		};
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
