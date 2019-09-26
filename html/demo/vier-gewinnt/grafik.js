const GetMaxX = 640;
const GetMaxY = 480;

const TriplexFont = 'Sans';
//const TriplexFont = 'TriplexFont';

const Black = 'black';
const Blue = 'blue';
const LightGray = 'LightGray';
const Red = 'red';
const White = 'white';

const EmptyFill = 'idk';
const SolidFill = 'Solidfill';
const Solidfill = 'Solidfill';

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

		Graph.canvas = canvas;
		Graph.context = canvas.getContext( '2d' );
		document.body.appendChild( Graph.canvas );
	} 
	Graph.canvas.style.display = 'block';
	
	// this doesn't really belong here, but whatever...
	if ( !Graph.crt ) {
		Graph.crt = document.createElement( 'div' );
		document.body.appendChild( Graph.crt );
	}
		
	Graph.crt.style.display = 'none';

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

const Rectangle = function( x1, y1, x2, y2 ) {
	Graph.context.fillStyle = Graph.bkColor;
	Graph.context.strokeStyle = Graph.color;

	let width = x2 - x1;
	let height = y2 - y1;
		
	Graph.context.beginPath();	
	Graph.context.rect( x1, y1, width, height );
	Graph.context.stroke();
};

const Line = function( x1, y1, x2, y2 ) {
	Graph.context.fillStyle = Graph.bkColor;
	Graph.context.strokeStyle = Graph.color;

	Graph.context.beginPath();	
	Graph.context.moveTo( x1, y1 );
	Graph.context.lineTo( x2, y2 );
	Graph.context.stroke();
};

const ClearViewPort = function() {
	console.log( 'grafik.ClearViewPort:' + toString( Graph.viewport ) );

	Graph.context.fillStyle = Graph.bkColor;

	if( Graph.viewport ) { 
		Graph.context.fillRect( Graph.viewport.x, Graph.viewport.y, Graph.viewport.w, Graph.viewport.h );
	} else {
		Graph.context.fillRect( 0, 0, GetMaxX, GetMaxY );
	}
};

const Delay = function( delay ) {
	// noop
};

const OutTextXY = function( x, y , text ) {
	Graph.context.font = Graph.textStyle.fontSize + 'px ' + Graph.textStyle.font; //'33px Arial';

	console.log( 'grafik:' + toString( {fn:'OutTextXY',x:x,y:y,text:text,font:Graph.context.font} ) );

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

const SetFillStyle = function( style, color ) {
	Graph.fillStyle = {style:style,color:color};
};

const SetTextJustify = function(a,b) {
	Graph.textJustify= {a:a,b:b};
};

const SetTextStyle = function(font,direction,fontSize) {
	// this is wack
	if ( fontSize < 10 ) { 
		fontSize = 10;
	}
	if ( isNaN( font ) ) {
		font = 'TriplexFont';
	}

	Graph.textStyle = { font:font, direction:direction, fontSize:fontSize };
};

const SetViewPort = function(a,b,X,Y,idk) {
	Graph.viewport = {x:a,y:b,w:X,h:Y,idk:idk};
	console.log( 'grafik.viewport:' + toString( Graph.viewport ) );
};

const FillEllipse = function( x, y, XRadius, YRadius ) {
	console.log( 'FillEllipse:' + JSON.stringify( {x:x,y:y,XRadius:XRadius,YRadius:YRadius} ) );

	Graph.context.fillStyle = Graph.bkColor;
	Graph.context.strokeStyle = Graph.color;

	Graph.context.fillStyle = Graph.fillStyle.color;

/*
	Graph.context.fillStyle = 'blue';
	Graph.context.strokeStyle = 'yellow';
*/


	Graph.context.beginPath();

	Graph.context.arc( x, y, XRadius, 0, 2 * Math.PI);  // this is not really right, but ok

	Graph.context.stroke();
	Graph.context.fill();
};


console.log( 'loaded grafik' );

