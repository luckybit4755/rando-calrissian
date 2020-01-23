const Utilo = {
	fullscreen: function( element ) {
		var fz = 'webkitRequestFullscreen requestFullScreen mozRequestFullScreen msRequestFullscreen webkitRequestFullscreen webkitRequestFullscreen'.split( ' ' );

		for ( var i = 0 ; i < fz.length ; i++ ) {
			var f = fz[ i ];
			if ( f in element ) {
				element[ f ]();
				break;
			}
		}
	}
	, frame: function( drawCallback, fps ) {
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
	}
	, getByTag: function( tag ) {
		return document.getElementsByTagName( tag || 'canvas' )[ 0 ];
	}
	, getById: function( id ) {
		return document.getElementById( id );
	}
	, makeElement: function( stuff ) {
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
	}

	/* from http://www.quirksmode.org/js/findpos.html */
	, elementPosition: function( element ) {
		var left = 0;
		var top = 0;
		if ( element.offsetParent ) {
			do {
				left += element.offsetLeft;
				top  += element.offsetTop;
			} while ( element = element.offsetParent );
		}
		return { x : left, y : top };
	}
};
