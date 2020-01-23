const Mouseo = {
	// note quite right, but ok...
	simpleControls: function( canvas ) {
		let last = 0;
		let dragged = false;
		let angleX = 0;
		let angleY = 0;
		let w = parseInt( canvas.width );
		let h = parseInt( canvas.height );

    	canvas.onmouseup = canvas.onblur = function() { 
			dragged = false;
		};
    	canvas.onmousemove = function( e ) {
    	    if ( !dragged ) return;
			e = {x:e.pageX,y:e.pageY};

			let dx = Mouseo.toAngle( e.x, dragged.x, w );
			let dy = Mouseo.toAngle( e.y, dragged.y, h );

    	    angleY += dx;
			angleX += dy;

    	    dragged = e;
    	    last = new Date().getTime();
    	};
    	canvas.onmousedown = function( e ) { 
			dragged = {x:e.pageX,y:e.pageY};
			canvas.onmousemove( e )
		};

		let matrix = function() {
			return Matrixo.multiply(
				  Matrixo.rotateX( Math.cos( angleX ), Math.sin( angleX ) ) 
				, Matrixo.rotateY( Math.cos( angleY ), Math.sin( angleY ) ) 
			);
		};

		let idle = function( timeout, delta ) {
			if ( !last || new Date().getTime() - last > timeout ) {
				angleX += delta;
				angleY += delta;
			}
		};

		return { matrix:matrix, idle:idle };
	}
	, toAngle: function( now, start, size ) {
		return ( now - start ) / size * 2 * Math.PI;
	}
};
