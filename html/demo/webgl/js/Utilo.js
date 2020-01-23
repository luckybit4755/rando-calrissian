const Utilo = {
	fullscreen: function( element ) {
		let fz = 'webkitRequestFullscreen requestFullScreen mozRequestFullScreen msRequestFullscreen webkitRequestFullscreen webkitRequestFullscreen'.split( ' ' );

		for ( let i = 0 ; i < fz.length ; i++ ) {
			let f = fz[ i ];
			if ( f in element ) {
				element[ f ]();
				break;
			}
		}
	}
	, frame: function( drawCallback, fps ) {
		fps = fps || 24;

		let frameFunction = function() {};
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
	, idk: function( v, alternative ) {
		return 'undefined' === typeof( v ) ? alternative : v;
	}
	, getByTag: function( tag, index ) {
		tag = Utilo.idk( tag, 'canvas' );
		index = Utilo.idk( index, 0 );
		let tagged = document.getElementsByTagName( tag );
		return isNaN( index ) ? tagged : tagged[ index ];
	}
	, getById: function( id ) {
		return document.getElementById( id );
	}
	, getByContents: function( value ) {
		let treeWalker = document.createTreeWalker(
			document.body
			, NodeFilter.SHOW_TEXT
			, { acceptNode: function(node) { return NodeFilter.FILTER_ACCEPT } }
			, false
		);

		while( treeWalker.nextNode() ) {
			let node = treeWalker.currentNode;
			if ( value === node.nodeValue.trim() ) {
				return node.parentNode;
			}
		}
		return false;
	}
	, makeElement: function( stuff ) {
		stuff.type = stuff.type || 'div';
		let element = document.createElement( stuff.type );
		for ( let k in stuff ) {
			if ( /^(kids|type)$/.test( k ) ) continue;
			switch ( k ) {
				case 'txt': element.appendChild( document.createTextNode( stuff[ k ] ) ); break;
				default: element.setAttribute( k, stuff[ k ] );
			}
		}
		if ( 'kids' in stuff ) {
			for ( let i = 0 ; i < stuff.kids.length ; i++ ) {
				element.appendChild( makeElement( stuff.kids[ i ] ) );
			}
		}
		return element;
	}
	, elementPosition: function( element ) {
		/* from http://www.quirksmode.org/js/findpos.html */
		let left = 0;
		let top = 0;
		if ( element.offsetParent ) {
			do {
				left += element.offsetLeft;
				top  += element.offsetTop;
			} while ( element = element.offsetParent );
		}
		return { x : left, y : top };
	}
	, identity: function( value ) {
		return value;
	}
	, flatten: function( value, converter, values ) {
		converter = Utilo.idk( converter, Utilo.identity );
		values = Utilo.idk( values, [] );
		if ( 'object' === typeof( value ) ) {
			for ( let key in value ) {
				Utilo.flatten( value[ key ], converter, values );
			}
		} else {
			values.push( converter( value ) );
		}
		return values;
	}
};
