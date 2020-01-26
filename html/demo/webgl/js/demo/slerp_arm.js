import Constantso  from '../lib/Constantso.js';
import Glo         from '../lib/Glo.js';
import Matrixo     from '../lib/Matrixo.js';
import Mesho       from '../lib/Mesho.js';
import Mouseo      from '../lib/Mouseo.js';
import Quaterniono from '../lib/Quaterniono.js';
import Shadero     from '../lib/Shadero.js';
import Utilo       from '../lib/Utilo.js';
import Vectoro     from '../lib/Vectoro.js';

const rando = function() { return Math.random(); }

const slerp_arm = function() {
	/* little dom fun */

	let canvas = Utilo.getByTag( 'canvas' );
	let mouseControls = Mouseo.simpleControls( canvas );
	Utilo.getByContents( 'fullscreen' ).onclick = function() { Utilo.fullscreen( canvas ); };

	/* setup */

	let gl = Glo.gl( canvas );
	let program = Glo.program( gl, Shadero.lit.vertex, Shadero.lit.fragment );

	let limb = new Limb( 0.44, 5 );
	//console.log( JSON.stringify( limb,(k,v)=>Utilo.floatless(v),'\t' ) );

	/* drawing loop */

	let t = 0.0;
	let t_velocity_start = 0.01;
	let t_velocity = t_velocity_start;
	let t_acceleration = 1.01;

	let root = Quaterniono.set( 0,0,0 );
	let axis = Mesho.axis();

	let draw = function() {
		Glo.clear( gl );

		//mouseControls.idle( 5000, 0.03 );
		let m = Matrixo.multiply( mouseControls.matrix(), Matrixo.scale( 0.66 ) );
		Glo.matrix( gl, program, 'uMatrix', m );

		let faces = [];
		let vertices = [0,0,0];
		limb.slerp( root, t, vertices, faces, 0 );

		let colors = vertices.map((v,i)=>i%3?t:1-t);

		if ( false ) {
			let msg = JSON.stringify( vertices,(k,v)=>Utilo.floatless(v) );
			console.log( Utilo.floatless( t ) + ': ' + msg );
		}

		t += t_velocity;
		let tClass = t < 0 ? 0 : ( t > 1 ? 1 : 33);
		switch( tClass ) {
			case 0: t = 0; t_velocity = +t_velocity_start; break;
			case 1: t = 1; t_velocity = -t_velocity_start; break;
			default: t_velocity *= t_acceleration;
		}

		Glo.data( gl, program, 'aPosition', vertices );
		Glo.data( gl, program, 'aColor', colors );
		Glo.draw( gl, faces, gl.LINES );

		Glo.data( gl, program, 'aPosition', axis.vertices );
		Glo.data( gl, program, 'aColor', axis.colors );
		Glo.draw( gl, axis.faces, gl.LINES );

		setTimeout( function() { requestAnimationFrame( draw ) }, 22 );
	};
	draw();
};

const Limb = function( length, depth, children ) {
	this.init = function( length, depth, children ) {
		depth = Utilo.idk( depth, 4 )
		children = Utilo.idk( children, 1 );

		this.start = this.rando();
		this.stop = this.rando();
		this.length = length;
		this.idk = Quaterniono.set( 0, this.length, 0 );

		if ( depth <= 0 ) return;

		this.limbs = [];

		if ( children > 10 ) throw 'planB';

		let nextLength   = length * 0.77;
		let nextDepth    = depth - 1;
		let nextChildren = children + 1;
		for ( let i = 0 ; i < children ; i++ ) {
			let limb = new Limb( nextLength, nextDepth, nextChildren );
			this.limbs.push( limb );
			//break;
		};
	};
	this.rando = function() {
		return Quaterniono.rotate(
			rando() * Math.PI * 2
			, Quaterniono.set( rando(), rando(), rando() )
		);
	};

	this.slerp = function( last, t, vertices, faces, parentIndex ) {
		let slerped = Quaterniono.slerp( this.start, this.stop, t );
		//slerped = Quaterniono.interpolateLinearly( this.start, this.stop, t );
		let rotated = Quaterniono.rotatePoint( slerped, this.idk );
		let next = Quaterniono.add( last, rotated );

		let index = vertices.length / 3;
		for ( let i = 0 ; i < 3 ; i++ ) {
			vertices.push( next[ i ] );
		}
		faces.push( parentIndex );
		faces.push( index );

		if ( !this.limbs ) return;

		for ( let i = 0 ; i < this.limbs.length ; i++ ) {
			let limb = this.limbs[ i ];
			limb.slerp( next, t, vertices, faces, index );
		}
	};

	this.init( length, depth, children );
};

slerp_arm();
