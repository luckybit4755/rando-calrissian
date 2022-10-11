#!/usr/bin/env node 

const fs = require( 'fs' );

// try ./line-form-collapse.js box-02.txt .993
class LineFormCollapse {
	constructor() {
		this.spatiality = .5;
	}

	////////////////////////////////////////////////////////////////////////////

	main( args ) {
		let filename = null;
		if ( 2 == args.length ) {
			filename = args[ 0 ];
			this.spatiality = parseFloat( args[ 1 ] );
			console.error( 'filename is', filename, '; spatiality is', this.spatiality );
		}
		this.learn( filename );
		this.spew();
	}

	////////////////////////////////////////////////////////////////////////////

	learn( filename, debug = false ) {
		this.world = new Map();
		this.learnYourLines( fs.readFileSync(filename).toString(), debug );
		this.knowledgeSpace( debug );
	}

	learnYourLines( fileContents, debug = false ) {
		const lines = fileContents.split( '\n' ).map( line => line.trim().split( '' ) );
		this.learnLines( lines, debug );
	}

	learnLines( lines, debug ) {
		let last = null;
		for ( const line of lines ) {
			if ( debug ) console.log( line.join( '' ) );
			line.forEach( (c,i) => {
				this.learnLine( c, i, line, last );
			});
			last = line;
		}
	}

	learnLine( c, i, line, last ) {
		const above = last ? last[ i ] : LineFormCollapse.NONE;
		const left = i ? line[ i - 1 ] : LineFormCollapse.NONE;
		const right = i < line.length - 1 ? line[ i + 1 ] : LineFormCollapse.NONE;
		this.addFact( above, LineFormCollapse.BELOW, c );
		this.addFact( c, LineFormCollapse.LEFT, left );
		this.addFact( c, LineFormCollapse.RIGHT, right );
	}

	addFact( c, direction, k ) {
		if ( !c || !k || LineFormCollapse.NONE === c || LineFormCollapse.NONE === k ) {
			return;
		}

		if ( !this.world.has( c ) ) {
			this.world.set( c, new Map() );
		}
		const cMap = this.world.get( c );

		if ( !cMap.has( direction ) ) {
			cMap.set( direction, new Set() );
		}
		const dSet = cMap.get( direction );

		dSet.add( k );
	}

	knowledgeSpace( debug = false ) {
		for ( const [c,cMap] of this.world.entries() ) {
			if ( LineFormCollapse.BLANK == c ) {
				if ( debug ) {
					console.log(c,cMap);
				}
				continue;
			}
			for ( const [d,dSet] of cMap.entries() ) {
				if ( dSet.has( LineFormCollapse.BLANK ) ) {
					const blanked = this.world.get( LineFormCollapse.BLANK ).get( d ) || new Set();
					const union = this.union( dSet, blanked );
					if ( union.size > dSet.size ) {
						if ( debug ) {
							console.log(c,d,dSet,'+',blanked,'->',union);
						}
						cMap.set( d, union ); // add in the transitive space rules
					} else {
						if ( debug ) {
							console.log(c,d,dSet,'...' );
						}
					}

				} else {
					if ( debug ) {
						console.log(c,d,dSet);
					}
				}
			}
		}
	}

	////////////////////////////////////////////////////////////////////////////

	spew( length = 88 ) {
		const keys = new Set( Array.from( this.world.keys() ) );
		let lastLine = new Array( length ).fill( LineFormCollapse.BLANK );


		const lul = () => lastLine = this.forth( keys, lastLine );
		setInterval( lul, 200 );
	}
	
	forth( keys, lastLine ) {
		let err = false;
		for ( let j = 0 ; j < 100 * 1000 ; j++ ) {
			//try {
				const nextLine = this.next( lastLine );
				this.isValid( nextLine );
				const s = nextLine.join( '' ).replace( /#/g, ' ' );
				//console.log( s, j, 'and', i, 'of', count );
				console.log( s );
				return nextLine;
			//} catch( e ) {
				err = e;
			//}
		}

		if ( err ) {
			throw new Error( 'gave up: ' + err );
			throw err;
		} else {
			throw new Error( 'at least I tried...' );
		}
	}

	oldspew( count = 44, length = 88 ) {
		const keys = new Set( Array.from( this.world.keys() ) );
		let lastLine = new Array( length ).fill( LineFormCollapse.BLANK );

		for ( let i = 0 ; i < count ; i++ ) {
			let err = false;
			for ( let j = 0 ; j < 10 * 1000 ; j++ ) {
				try {
					const nextLine = this.next( lastLine );
					this.isValid( nextLine );
					const s = nextLine.join( '' ).replace( /#/g, ' ' );
					//console.log( s, j, 'and', i, 'of', count );
					console.log( s );

					lastLine = nextLine;
					err = false;
					break;
				} catch( e ) {
					err = e;
				}
			}
			if ( err ) {
				console.log( 'felgercarb', err );
				break;
			}
		}
	}

	isValid( nextLine, debug = false  ) {
		for ( let i = 0 ; i < nextLine.length - 1 ; i++ ) {
			const a = nextLine[ i ];
			const r = nextLine[ i + 1 ];
			const k = this.world.get( a ).get( LineFormCollapse.RIGHT );
			if ( debug ) {
				console.log( a, r, k, k.has( r ) );
			}
			if ( !k.has( r ) ) {
				throw new Error( `inValid: ${a}${r}` );
			}
		}
		return true;
	}

	next( lastLine ) {
		const line = new Array( lastLine.length );

		// first restrict based on last line
		let left = null;
		for ( let j = 0 ; j < lastLine.length ; j++ ) {
			let above = lastLine[ j ];
			if ( !this.world.has( above ) ) {
				throw new Error( `dunno about ${above}` );
			}
			if ( !this.world.get( above ).has( LineFormCollapse.BELOW ) ){
				throw new Error( `dunno what can be below ${above}` );
			}
			line[ j ] = this.world.get( above ).get( LineFormCollapse.BELOW );
			if ( left ) {
				const ok = this.all( left, LineFormCollapse.RIGHT );
				const x = this.intersect( line[ j ], ok );
				if ( !x.size ) {
					const l = Array.from( left );
					throw new Error( `could find nothing below ${above} and right of ${l}` );
				}
				line[ j ] = x;
			}

			left = line[ j ];
		}

		this.collapse( line, lastLine.length );

		const lion = line.map( v => {
			const a = Array.from( v );
			if ( !a.length ) throw new Error( 'nope...' );
			return a[ 0 ];
		});
		return lion;
	}
				
	collapse( line, length, debug = false ) {
		let q = 0;
		const max = length * length;
		for ( q = 0 ; q < max ; q++ ) {
			let least = 0;
			for ( let i = 0 ; i < length ; i++ ) {
				const set = line[ i ];
				if ( set.size > 1 && ( !least || set.size < least ) ) {
					least = set.size;
				}
			}
			if ( !least ) {
				break;
			}

			const lesser = [];
			for ( let i = 0 ; i < length ; i++ ) {
				const set = line[ i ];
				if ( set.size === least ) {
					lesser.push( {i:i,set:set} );
				}
			}
			const pick = lesser[ Math.floor( Math.random() * lesser.length ) ];

			line[ pick.i ] = new Set( this.rnd( line[ pick.i ] ) );
			if ( debug ) {
				console.log( least, lesser.length, pick, '->', line[ pick.i ] );
			}
			this.recurse( line, pick.i, pick.i - 1, debug );
			this.recurse( line, pick.i, pick.i + 1, debug );
		}

		if ( q > max - 2 ) {
			throw new Error( 'ur doomed' );
		}
	}

	recurse( line, from, to, debug = false ) {
		if ( to < 0 || to >= line.length || 1 === line[ to ].size ) return;

		const direction = ( to < from ) ? LineFormCollapse.LEFT : LineFormCollapse.RIGHT;
		const allowed = this.all( line[ from ], direction );
		const nu = this.intersect( allowed, line[ to ] );
		//const ok = new Set( this.rnd( nu ) );

		if ( debug ) {
			const f = Array.from( line[ from ] ).join( '' );
			const t = Array.from( line[ to ] ).join( '' );
			console.log( 'recurse ', from + ':' + f, to + ':' + t, 'is', direction, 'so', allowed, 'gives', nu );//, '->', ok );
		}

		//line[ to ] = ok;
		if ( nu.size != line[ to ].size ) {
			line[ to ] = nu; // ok
			this.recurse( line, to, to - 1, debug );
			this.recurse( line, to, to + 1, debug );
		}
	}

	// input is a set... 
	all( input, direction, debug = false ) {
		const output = new Set();
		if ( debug ) {
			console.log( input );
		}
		for ( const i of input ) {
			const w = this.world.get( i ).get( direction );
			for ( const c of w ) {
				output.add( c );
			}
		}
		if ( debug ) {
			console.log( input, direction, output );
		}
		return output;
	}

	union( a, b ) {
		return new Set( [...a,...b] );
	}

	intersect( a, b ) {
		const i = new Set();
		for ( const v of a ) {
			if ( b.has( v ) ) {
				i.add( v );
			}
		}
		return i;
	}

	rnd( set ) {
		if ( !set.size ) {
			throw new Error( 'set imploded... ');
		}

		// spatial policy
		if ( set.has( LineFormCollapse.BLANK ) ) {
			if ( Math.random() < this.spatiality ) {
				return LineFormCollapse.BLANK;
			} else {
				if ( set.size > 1 ) {
					set.delete( LineFormCollapse.BLANK );
				}
			}
		}

		const r = Math.floor( Math.random() * set.size );
		return Array.from( set )[ r ];
	}

	////////////////////////////////////////////////////////////////////////////

	static BELOW = 'v';
	static LEFT = '<';
	static RIGHT = '>';

	static NONE = ' ';
	static BLANK = '#';

	static EGG = `
		#########
		#┌┐#┌┬┐##
		#└┘#└┴┘##
		#########
		#┌┬┐#┌┐##
		#├┼┤#├┤##
		#└┴┘#└┘##
		#########
		#┌─┬─┐###
		#├─┼─┤###
		#└─┴─┘###
		#########
		#┌──┬──┐#
		#│##│##│#
		#│##│##│#
		#├──┼──┤#
		#│##│##│#
		#│##│##│#
		#└──┴──┘#
		#########
		#┌────┐##
		#│┌──┐│##
		#└┤#┌┤│##
		##└─┘└┘##
		#########
		##┌──┐###
		#┌┘##└┐##
		#└────┘##
		#########
		`;

	////////////////////////////////////////////////////////////////////////////
};

new LineFormCollapse().main( process.argv.slice( 2 ) );
