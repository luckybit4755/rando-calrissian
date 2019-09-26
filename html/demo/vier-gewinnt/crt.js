const RestoreCrtMode = function() {
	Graph.canvas.style.display = 'none';
	Graph.crt.innerHTML = '';
	Graph.crt.style.display = 'block';

	addLine();
};

const addLine = function() {
	Graph.crt.current = document.createElement( 'div' );
	Graph.crt.current.innerHTML = '';
	Graph.crt.appendChild( Graph.crt.current );
};

const Writeln = function( text ) {
	Write( text );
	addLine();
};

const Write = function( text ) {
	Graph.crt.current.innerHTML += text || ''
};

const TextColor = function( color ) {
	Graph.crt.current.style.color = color;
};

const Exit = function() {
	alert( 'lol... naw...' );
};
