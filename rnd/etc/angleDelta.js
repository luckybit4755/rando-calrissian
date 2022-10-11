#!/usr/bin/env node 

const RANGE = 10;

class angleDelta {
	constructor() {
	}

	main( args ) {
		const results = [];
		for ( let i = 0 ; i < 33 ; i++ ) {
			results.push( this.trial() );
		}

		results.sort( (a,b) => a.dE - b.dE );
		console.table( results );
	}

	/*

       b   p2
        l2/\
         /  \ c
        /\d  \
	   p -----> p1
          l1
          a
	*/
	trial() {
		// random center
		const p = this.pt();

		// two random angles from 0 - 2pi
		const d = this.pos( Math.PI * 1 );
		const r1 = this.pos( Math.PI * 1 );
		const r2 = d + r1;
		const a1 = Math.min( r1, r2 );
		const a2 = Math.max( r1, r2 );

		// two lengths
		const l1 = .1 + this.pos();
		const l2 = .1 + this.pos();

		// two points along angle at given length
		const p1 = this.trig( p, a1, l1 );
		const p2 = this.trig( p, a2, l2 );

		// differences from p to p1, p to p2 and p1 to p2 (for loc)
		const a = this.subtract( p1, p );
		const b = this.subtract( p2, p );
		const c = this.subtract( p1, p2 );

		// lenght of same
		const al = this.length( a );
		const bl = this.length( b );
		const cl = this.length( c );

		// product of the 2 lengths
		const ab = al * bl;

		// https://www.cuemath.com/geometry/angle-between-vectors/
		// dot / length product and angle
		const dL = this.dot( a, b ) / ab;
		const dA = Math.acos( dL );

		// cross / length product and angle
		const xL = this.length( this.cross( a, b ) ) / ab;
		const xA = Math.asin( xL );

		// law of cosines angle
		// https://www.mathsisfun.com/algebra/trig-cosine-law.html
		// https://stackoverflow.com/questions/1211212/how-to-calculate-an-angle-from-three-points
		//arccos((P12^2 + P13^2 - P23^2) / (2 * P12 * P13))
		const cA = Math.acos(
			( al * al + bl * bl - cl * cl ) / ( 2 * al * bl )
		);

		// difference vs d
		// dA and cA seem to always match and match when d < PI
		// xA works when d < PI * .5
		const dE = Math.abs( Math.abs( d ) - Math.abs( dA ) );
		const xE = Math.abs( Math.abs( d ) - Math.abs( xA ) );
		const cE = Math.abs( Math.abs( d ) - Math.abs( cA ) );

		const ok = dE < .0001 ? true : false;
		return this.flooro({ 
			ok, d, 
			dA, dE, dL, 
			xA, xE, xL, 
			cA, cE
		});
	}

	trig( pt, a, l ) {
		const p = pt.slice();

		p[ 0 ] += l * Math.cos( a );
		p[ 1 ] += l * Math.sin( a );
		return p;

		return pt.map( (v,i)=>
			i 
			? i == 1 ? v + Math.sin( a ) + l : v
			: v + Math.cos( a ) + l
		);
	}

	cross( b, c ) {
		return [ 
		//x   y    z      z    y
			b[1]*c[2] - b[2]*c[1],
			b[2]*c[0] - b[0]*c[2],
			b[0]*c[1] - b[1]*c[0] ];
	}

	dot( b, c ) {
		return b.reduce( (s,v,i) => s + v * c[ i ], 0 );
	}

	floor( v, p = 1000 ) {
		return isNaN(v) ? v : Math.floor( v * p ) / p;
	}

	flooro( o, p = 1000 ) {
		const q = {};
		for ( const [k,v] of Object.entries( o ) ) {
			q[ k ] = this.floor( v );
		}
		return q;
	}

	json( o, p = 1000 ) {
		return JSON.stringify( o, (k,v)=> this.floor(v));
	}

	pos( n = RANGE ) {
		return Math.random() * n;
	}

	n( n = RANGE ) {
		return this.pos( n ) - this.pos( n );
	}
	
	pt( arity = 3, n = RANGE ) {
		return new Array( arity ).fill( 0 ).map( _ => this.n( n ) );
	}

	unit( pt ) {
		const l = this.length( pt );
		pt.forEach( (v,i) => pt[ i ] = v / l );
		return pt;
	}

	length( pt ) {
		return Math.sqrt( pt.reduce( (s,v)=>s+v*v, 0 ) );
	}

	// subtract a from b
	subtract( b, a ) {
		return b.map( (v,i)=> v - a[ i ] );
	}
};

new angleDelta().main( process.argv.slice( 2 ) );
