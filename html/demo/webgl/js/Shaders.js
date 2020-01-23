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
			precision mediump float;

			attribute vec4  aPosition;
			varying   vec4  vPosition;

			attribute vec4  aColor;
			varying   vec4  vColor;

			uniform   mat4  uMatrix;

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
	, texture: {
		vertex:`
			precision mediump float;

			attribute vec4  aPosition;

			attribute vec2  aTexture;
			varying   vec2  vTexture;

			void main() {
				   gl_Position = aPosition;
				   vTexture = aTexture;
			}
		`
		, fragment:`
			precision mediump float;

			varying vec2      vTexture;
			uniform sampler2D uSampler;

			void main(void) {
				gl_FragColor = texture2D( uSampler, vTexture );
			}
		`
	}
	, normal: {
		vertex:`
			precision mediump float;

			attribute vec4  aPosition;
			varying   vec4  vPosition;

			attribute vec4  aColor;
			varying   vec4  vColor;

			attribute vec4  aNormal; // short for "Abby Normal"
			varying   vec4  vNormal;

			uniform   mat4  uMatrix;

			void main() {
				   gl_Position = uMatrix * aPosition;
				   vPosition = gl_Position;
				   vColor = aColor;
				   vNormal = uMatrix * aNormal; 
			}
		`
		, fragment:`
			precision mediump float;

			varying vec4 vColor; 
			varying vec4 vPosition; 
			varying vec4 vNormal;

			float lightStrength = 6.0;
			vec4  lightPosition = vec4( 3,0,-3,0 );
			vec4  light = normalize( lightPosition );

			void main(void) {
				float lightValue = dot( vNormal, light );
				float lightDistance = length( vPosition - lightPosition );

				lightValue += 0.33;
				lightValue *= lightValue;
				
				lightDistance /= lightStrength;
				lightDistance *= lightDistance;

				gl_FragColor = lightValue * vColor / lightDistance + 0.033 * vColor;
			}
		`
	}
};
