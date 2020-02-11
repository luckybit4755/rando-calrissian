// opposing index is ( index + 3 ) % 6

const DIRECTIONS = {
	  NE : { index:0, angle:0.25 * Math.PI, opposite:'SW', offsets: [{x:+1,y:-1} , {x:+1,y:+0}] }
	, N  : { index:1, angle:0.50 * Math.PI, opposite:'S' , offsets: [{x:+0,y:-1} , {x:+0,y:-1}] } 
	, NW : { index:2, angle:0.75 * Math.PI, opposite:'SE', offsets: [{x:-1,y:-1} , {x:-1,y:+0}] }
	, SW : { index:3, angle:1.25 * Math.PI, opposite:'NE', offsets: [{x:-1,y:+0} , {x:-1,y:+1}] }
	, S  : { index:4, angle:1.50 * Math.PI, opposite:'N' , offsets: [{x:+0,y:+1} , {x:+0,y:+1}] }
	, SE : { index:5, angle:1.75 * Math.PI, opposite:'NW', offsets: [{x:+1,y:+0} , {x:+1,y:+1}] }
};

const Hexactions = {
	labels: Object.keys( DIRECTIONS )
	, directionAt: function( index ) {
		return this.labels[ index % 6 ];
	}
	, indexOf: function( direction ) {
		return this.labels.indexOf( direction );
	}
	, opposite: function( direction ) {
		return this.directionAt( this.indexOf( direction ) + 3 );
	}
	, angle: function( direction ) {
		return DIRECTIONS[ direction ].angle;
	}
	, rotate: function( direction, orientation ) {
		return this.directionAt( DIRECTIONS[ direction ].index + orientation );
		let rotated = ( DIRECTIONS[ direction ].index + orientation ) % 6;
		return this.Object.keys( DIRECTIONS )[ rotated ];
	}
	// odd columns(x), all row(y)
	, offset: function( current, direction ) {
		return { 
			  x: current.x + DIRECTIONS[ direction ].offsets[ current.x & 1 ].x
			, y: current.y + DIRECTIONS[ direction ].offsets[ current.x & 1 ].y 
		}
	}
	// https://www.redblobgames.com/grids/hexagons/#hex-to-pixel (oddq)
	// something is hinky with this...
	, toScreen( tile, w, h ) {
		return {
			  x: w * 3/2 * tile.x
    		, y: h * Math.sqrt(3) * ( tile.y + 0.5 * (tile.x&1))
		}
	}
/*
	, pixel_to_flat_hex(point) {
    var q = ( 2./3 * point.x                        ) / size
    var r = (-1./3 * point.x  +  sqrt(3)/3 * point.y) / size
    return hex_round(Hex(q, r))
	}
*/
};
