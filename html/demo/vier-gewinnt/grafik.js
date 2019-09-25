const GetMaxX = 640;
const GetMaxY = 480;

const TriplexFont = 'TriplexFont';
const White = 'white';
const Blue = 'blue';
const Black = 'black';
const EmptyFill = 'idk';

const Graph = {
	  bkColor   : White
	, color     : Black
	, fillStyle : {idk:33,color:White}
};

const InitGraph = function() {
	if ( !Graph.canvas ) {
		let canvas = document.createElement( 'canvas' );
		canvas.setAttribute( 'width', GetMaxX );
		canvas.setAttribute( 'height', GetMaxY );
		canvas.style.border = '1px solid black';
		canvas.style.display = 'block';

		Graph.canvas = canvas;
		Graph.context = canvas.getContext( '2d' );
		document.body.appendChild( Graph.canvas );
	}
	
	// this doesn't really belong here, but whatever...
	if ( !Graph.crt ) {
		Graph.crt = document.createElement( 'div' );
		document.body.appendChild( Graph.crt );
		Graph.crt.style.display = 'none';
	}

	if ( !Graph.line ) {
		Graph.line = document.createElement( 'input' );
		Graph.line.setAttribute( 'size', 77 );
		Graph.line.setAttribute( 'disabled', 44 );
		Graph.line.style.background = 'White';

		document.body.appendChild( Graph.line );
	}
};

const TextHeight = function( text ) {
	return 13;
};

// from https://www.freepascal.org/docs-html/rtl/graph/bar3d.html
// 
// Bar3d draws a 3-dimensional Bar with corners at (X1,Y1) and (X2,Y2)
// and fills it with the current color and fill-style. Depth specifies
// the number of pixels used to show the depth of the bar.
// 
// If Top is true; then a 3-dimensional top is drawn.
//
const Bar3D = function( x1, y1, x2, y2, depth, top ) {
	Graph.context.fillStyle = Graph.color;
	if ( x1 > x2 ) {
		let tmp = x1;
		x1 = x2;
		x2 = tmp;
	}
	if ( y1 > y2 ) {
		let tmp = y1;
		y1 = y2;
		y2 = tmp;
	}

	let width = x2 - x1;
	let height = y2 - y1;

	Graph.context.fillStyle = Graph.bkColor;
	Graph.context.fillRect( x1, y1, width, height );

	Graph.context.strokeStyle = Graph.color;
	Graph.context.rect( x1, y1, width, height );

	if ( top ) {
		Graph.context.moveTo( x1, y1 );
		Graph.context.lineTo( x1 + depth, y1 - depth );
		Graph.context.lineTo( x2 + depth, y1 - depth ); 
		Graph.context.lineTo( x2, y1 );
		Graph.context.lineTo( x2 + depth, y1 - depth );
		Graph.context.lineTo( x2 + depth, y2 - depth );
		Graph.context.lineTo( x2, y2 );
	}

	Graph.context.stroke();
};

const ClearViewPort = function() {
	console.log( toString( Graph ) );
	Graph.context.fillStyle = Graph.bkColor;
	Graph.context.fillRect( 0, 0, GetMaxX, GetMaxY );
};

const Delay = function( delay ) {
	// noop
};

const OutTextXY = function( x, y , text ) {
	Graph.context.font = Graph.textStyle.fontSize + 'px ' + Graph.textStyle.font; //'33px Arial';
	//Graph.textStyle = { font:font, direction:direction, fontSize:fontSize };

	Graph.context.fillStyle = Graph.color;
	Graph.context.fillText( text, x, y );
};

const enableLine = function() {
	Graph.line.removeAttribute( 'disabled' );
	Graph.line.value = '';
	Graph.line.focus();
};

const disableLine = function() {
	Graph.line.setAttribute( 'disabled', 33 );
	Graph.line.blur();
	Graph.line.value = '';
};

const Readln = function( callback ,xo ) {
	enableLine();

	Graph.line.onkeypress = function( e ) {
		if ( 13 == e.keyCode ) {
			let value = Graph.line.value.trim();
			console.log( 'u hit enter: ' + value );

			disableLine();

			if ( callback ) {
				//return true means more lines needed
				if ( callback( value ) ) {
					enableLine();
				}
			}
		}
	}
};

const SetBkColor = function( color ) {
	Graph.bkColor = color;
};

const SetColor = function( color ) {
	Graph.color = color;
};

const SetFillStyle = function( idk, color ) {
	Graph.fillStyle = {idk:idk,color:color};
};

const SetTextJustify = function(a,b) {
	Graph.textJustify= {a:a,b:b};
};

const SetTextStyle = function(font,direction,fontSize) {
	Graph.textStyle = { font:font, direction:direction, fontSize:fontSize };
};

const SetViewPort = function(a,b,X,Y,idk) {
};

console.log( 'loaded grafik' );
