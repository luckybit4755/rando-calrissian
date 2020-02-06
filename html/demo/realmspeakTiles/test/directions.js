// opposing index is ( index + 3 ) % 6
// N -> y - 1
// S -> y + 1
// W -> x - 1
// E -> x + 1

// screen coordinates / tile coordinates are annoying..

const DX = 0.74;
const DY = 0.50;

const DIRECTIONS = {
	  NE : { x:100, y :  0, index:0, opposing:'SW', opposingIndex:3, dx:+DX, dy:-DY }
	, N  : { x: 50, y :  0, index:1, opposing:'S' , opposingIndex:4, dx:+0, dy:-1 }
	, NW : { x:  0, y :  0, index:2, opposing:'SE', opposingIndex:5, dx:-DX, dy:-DY }
	, SW : { x:  0, y :100, index:3, opposing:'NE', opposingIndex:0, dx:-DX, dy:+DY }
	, S  : { x: 50, y :100, index:4, opposing:'N' , opposingIndex:1, dx:+0, dy:+1 }
	, SE : { x:100, y :100, index:5, opposing:'NW', opposingIndex:2, dx:+DX, dy:+DY }
};

