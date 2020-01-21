const Shaders = {
	simple: {
		vertex:`
			attribute vec4 aPosition;
			attribute vec4 aColor;

			uniform mat4 uMatrix;
			varying vec4 vColor;
			void main() {
				   gl_Position = uMatrix * aPosition;
				   vColor = aColor;
			}
		`
		, fragment:`
			precision mediump float;
			varying vec4 vColor; 
			void main(void) {
				gl_FragColor = vColor;
			}
		`
	}
	, lit: {
		vertex:`
			attribute vec4 aPosition;
			attribute vec4 aColor;

			uniform mat4 uMatrix;

			varying vec4 vColor;
			varying vec4 vPosition;

			void main() {
				   gl_Position = uMatrix * aPosition;
				   vColor = aColor;
				   vPosition = gl_Position;
			}
		`
		, fragment:`
			precision mediump float;
			varying vec4 vColor; 
			varying vec4 vPosition; 

			vec4 light = vec4( 0.5774, 0.5774, 0.5774, 0 );
			//vec4 light = vec4( 0.2,0.2,0.2,0 );

			float fuzz( float c, float power ) {
				return pow( 256.0 * c, power ) / 256.0;
			}

			void main(void) {
				float lightValue = 1.0 - dot( vPosition, light );
				vec4 farqo = vec4(
					fuzz( vColor[ 0 ], lightValue), 
					fuzz( vColor[ 1 ], lightValue), 
					fuzz( vColor[ 2 ], lightValue), 
					1
				);
				gl_FragColor = farqo * 0.4 + 0.6 * vColor;
			}
		`
	}
};
