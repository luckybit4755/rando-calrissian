import Glo         from '../lib/Glo.js';
import Mesho       from '../lib/Mesho.js';
import Quaterniono from '../lib/Quaterniono.js';
import Shadero     from '../lib/Shadero.js';
import Utilo       from '../lib/Utilo.js';
import Vectoro     from '../lib/Vectoro.js';

export default function() {
	let setup = Glo.demoSetup( Shadero.lit );

	/* setup */

	let limb = new Limb( 0.44, 5 );

	/* drawing loop */

	let t = 0.0;
	let t_velocity_start = 0.01;
	let t_velocity = t_velocity_start;
	let t_acceleration = 1.01;

	let root = Quaterniono.set( 0,0,0 );
	let axis = Mesho.axis();
	axis.type = setup.gl.LINES;

	let draw = function() {
		setup.mouseLoop();

		let faces = [];
		let vertices = [0,0,0];

		limb.slerp( root, t, vertices, faces, 0 );

		let colors = vertices.map((v,i)=>i%3?t:1-t);

	    let mesh = { attributes:{ aPosition: vertices, aColor: colors }, faces:faces, type:setup.gl.LINES }

		Glo.drawMesh( setup.gl, setup.program, mesh );
		Glo.drawMesh( setup.gl, setup.program, axis );

		///

		t += t_velocity;
		let tClass = t < 0 ? 0 : ( t > 1 ? 1 : 33);
		switch( tClass ) {
			case 0: t = 0; t_velocity = +t_velocity_start; break;
			case 1: t = 1; t_velocity = -t_velocity_start; break;
			default: t_velocity *= t_acceleration;
		}
	};

	Utilo.frame( draw, 60 ).start();
};

const rando = function() { return Math.random(); }

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

