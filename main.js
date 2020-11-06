keyEventListener();

main();

//
// Start here
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
	attribute vec4 aVertexPosition;
	attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
	uniform mat4 uProjectionMatrix;
	
	varying lowp vec4 vColor;

	void main() {
		gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
		vColor = aVertexColor;
	}
  `;

  // Fragment shader program

	const fsSource = `
	varying lowp vec4 vColor;

	void main() {
		gl_FragColor = vColor;
	}
	`;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
		},
	};

	//add background to render queue
	renderQueue.push(new Background(programInfo, gl));
	renderQueue.push(new OPiece(programInfo, gl));

	function render(now){
		renderQueue.forEach(element => {
			element.drawObject();
		});
		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
}
