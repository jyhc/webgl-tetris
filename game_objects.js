class GameObject {
    constructor(programInfo, gl) {
        this.programInfo = programInfo;
        this.gl = gl;
        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        this.modelViewMatrix = mat4.create();

        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.
        
        this.projectionMatrix = mat4.create();

        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
    
        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.perspective(this.projectionMatrix,
                        fieldOfView,
                        aspect,
                        zNear,
                        zFar);
    }

    drawObject() {
        console.log("Not implemented!");
    }
}

class Background extends GameObject {
    constructor(programInfo, gl) {
        super(programInfo, gl);
        const posncol = this.create_grid();
        this.positions = posncol.tetris_grid_position;
        this.colors = posncol.tetris_grid_color;
        
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
    
        mat4.translate(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to translate
            [0.0, 0.0, -5.0]);  // amount to translate

        mat4.scale(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to scale
            [1.0, 2.0, 1.0]);  // amount to scale
    }

    drawObject() {
        const buffers=initBuffers(this.gl, this.positions, this.colors);

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        this.gl.clearDepth(1.0);                 // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things
    
        // Clear the canvas before we start drawing on it.
    
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                    this.programInfo.attribLocations.vertexPosition);
        }
    
        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const numComponents = 4;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                    this.programInfo.attribLocations.vertexColor);
        }

        // Tell WebGL to use our program when drawing
    
        this.gl.useProgram(this.programInfo.program);
    
        // Set the shader uniforms
    
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix);
            this.gl.uniformMatrix4fv(
                this.programInfo.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix);

        this.drawGrid();
    }

    //draw grid of tetris
    drawGrid(){
        const offset = 0;
        const vertexCount = 2;
        // gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        for(var i = 0; i <= 31; i++){
            this.gl.drawArrays(this.gl.LINE_STRIP, offset + 2*i, vertexCount);	
        }
    }

    create_grid(){
        const tetris_grid_position = Array(lineHeight*4+lineWidth*4);
        
        //vertical lines
        for(var i = 0; i <= lineWidth; i++){
            tetris_grid_position[i*4] = unitWidth*i + -1.0;
            tetris_grid_position[i*4+1] = 1.0;
            tetris_grid_position[i*4+2] = unitWidth*i + -1.0;
            tetris_grid_position[i*4+3] = -1.0;
        }
        
        const arrayOffset = 11*4;
        //horizontal lines
        for(var i = 0; i <= lineHeight; i++){
            tetris_grid_position[i*4+arrayOffset] = -1.0;
            tetris_grid_position[i*4+arrayOffset+1] = unitHeight*i + -1.0;
            tetris_grid_position[i*4+arrayOffset+2] = 1.0;
            tetris_grid_position[i*4+arrayOffset+3] = unitHeight*i + -1.0;
        }
        
        var tetris_grid_color = Array((lineHeight+1)*8+(lineWidth+1)*8);
        
        for(var i = 0; i < tetris_grid_color.length; i++){
            tetris_grid_color[i] = 0.45;
            // if(i % 4 == 0){tetris_grid_color[i] = 1.0}
        }
    
        return {
            tetris_grid_position,
            tetris_grid_color, 
        };
    }
}

class OPiece extends GameObject {
    constructor(programInfo, gl) {
        super(programInfo, gl);
        const pieceWidth = (2.0/lineWidth)*2;
        const pieceHeight = (2.0/lineHeight)*2;
        this.positions = [
            -0.2,  1.0,
            -0.2 + pieceWidth,  1.0,
            -0.2, 1.0 - pieceHeight,
            -0.2 + pieceWidth, 1.0 - pieceHeight,
        ];

        this.cx = 0.0;
        this.cy = 0.9;

        this.colors = [
            1.0,  0.0,  0.0,  1.0,    // red
            1.0,  0.0,  0.0,  1.0,
            1.0,  0.0,  0.0,  1.0,
            1.0,  0.0,  0.0,  1.0,
        ];
        
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
    
        mat4.translate(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to translate
            [0.0, 0.0, -5.0]);  // amount to translate

        mat4.scale(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to scale
            [1.0, 2.0, 1.0]);  // amount to scale
    }

    drawObject() {
        const buffers=initBuffers(this.gl, this.positions, this.colors);
    
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                    this.programInfo.attribLocations.vertexPosition);
        }
    
        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const numComponents = 4;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                    this.programInfo.attribLocations.vertexColor);
        }

        // Tell WebGL to use our program when drawing
    
        this.gl.useProgram(this.programInfo.program);
    
        // Set the shader uniforms
    
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix);
            this.gl.uniformMatrix4fv(
                this.programInfo.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);	
    }
}

class IPiece extends GameObject {
    constructor(programInfo, gl) {
        super(programInfo, gl);
        const pieceWidth = (2.0/lineWidth)*4;
        const pieceHeight = (2.0/lineHeight);
        this.positions = [
            -0.4,  1.0,
            -0.4 + pieceWidth,  1.0,
            -0.4, 1.0 - pieceHeight,
            -0.4 + pieceWidth, 1.0 - pieceHeight,
        ];

        this.cx = 0.0 + unitWidth/2;
        this.cy = 1.0 - unitHeight/2;

        this.colors = [
            0.0,  0.5,  0.0,  1.0,
            0.0,  0.5,  0.0,  1.0,
            0.0,  0.5,  0.0,  1.0,
            0.0,  0.5,  0.0,  1.0,
        ];
        
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
    
        mat4.translate(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to translate
            [0.0, 0.0, -5.0]);  // amount to translate

        mat4.scale(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to scale
            [1.0, 2.0, 1.0]);  // amount to scale
    }

    drawObject() {
        const buffers=initBuffers(this.gl, this.positions, this.colors);
    
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                    this.programInfo.attribLocations.vertexPosition);
        }
    
        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const numComponents = 4;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                    this.programInfo.attribLocations.vertexColor);
        }

        // Tell WebGL to use our program when drawing
    
        this.gl.useProgram(this.programInfo.program);
    
        // Set the shader uniforms
    
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix);
            this.gl.uniformMatrix4fv(
                this.programInfo.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);	
    }
}

class SPiece extends GameObject {
    constructor(programInfo, gl) {
        super(programInfo, gl);
        const pieceWidth = (2.0/lineWidth)*2;
        const pieceHeight = (2.0/lineHeight);
        this.positions = [
            -0.2,  1.0,
            -0.2 + pieceWidth,  1.0,
            -0.2, 1.0 - pieceHeight,
            -0.2 + pieceWidth, 1.0 - pieceHeight,
            -0.4,  1.0 - pieceHeight,
            -0.4 + pieceWidth,  0.9,
            -0.4, 0.9 - pieceHeight,
            -0.4 + pieceWidth, 0.9 - pieceHeight,
        ];

        this.cx = 0.0 - unitWidth/2;
        this.cy = 1.0 - unitHeight/2;

        this.colors = [
            0.2,  0.2,  0.8,  1.0,
            0.2,  0.2,  0.8,  1.0,
            0.2,  0.2,  0.8,  1.0,
            0.2,  0.2,  0.8,  1.0,
            0.2,  0.2,  0.8,  1.0,
            0.2,  0.2,  0.8,  1.0,
            0.2,  0.2,  0.8,  1.0,
            0.2,  0.2,  0.8,  1.0,
        ];
        
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
    
        mat4.translate(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to translate
            [0.0, 0.0, -5.0]);  // amount to translate

        mat4.scale(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to scale
            [1.0, 2.0, 1.0]);  // amount to scale
    }

    drawObject() {
        const buffers=initBuffers(this.gl, this.positions, this.colors);
    
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                    this.programInfo.attribLocations.vertexPosition);
        }
    
        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const numComponents = 4;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                    this.programInfo.attribLocations.vertexColor);
        }

        // Tell WebGL to use our program when drawing
    
        this.gl.useProgram(this.programInfo.program);
    
        // Set the shader uniforms
    
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix);
            this.gl.uniformMatrix4fv(
                this.programInfo.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 8);	
    }
}

class ZPiece extends GameObject {
    constructor(programInfo, gl) {
        super(programInfo, gl);
        const pieceWidth = (2.0/lineWidth)*2;
        const pieceHeight = (2.0/lineHeight);
        this.positions = [
            -0.4,  1.0,
            -0.4 + pieceWidth,  1.0,
            -0.4, 1.0 - pieceHeight,
            -0.4 + pieceWidth, 1.0 - pieceHeight,
            -0.2,  1.0 - pieceHeight,
            -0.2 + pieceWidth,  0.9,
            -0.2, 0.9 - pieceHeight,
            -0.2 + pieceWidth, 0.9 - pieceHeight,
        ];

        this.cx = 0.0 - unitWidth/2;
        this.cy = 1.0 - unitHeight/2;

        this.colors = [
            0.9,  0.9,  0.1,  1.0,
            0.9,  0.9,  0.1,  1.0,
            0.9,  0.9,  0.1,  1.0,
            0.9,  0.9,  0.1,  1.0,
            0.9,  0.9,  0.1,  1.0,
            0.9,  0.9,  0.1,  1.0,
            0.9,  0.9,  0.1,  1.0,
            0.9,  0.9,  0.1,  1.0,
        ];
        
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
    
        mat4.translate(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to translate
            [0.0, 0.0, -5.0]);  // amount to translate

        mat4.scale(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to scale
            [1.0, 2.0, 1.0]);  // amount to scale
    }

    drawObject() {
        const buffers=initBuffers(this.gl, this.positions, this.colors);
    
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                    this.programInfo.attribLocations.vertexPosition);
        }
    
        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const numComponents = 4;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                    this.programInfo.attribLocations.vertexColor);
        }

        // Tell WebGL to use our program when drawing
    
        this.gl.useProgram(this.programInfo.program);
    
        // Set the shader uniforms
    
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix);
            this.gl.uniformMatrix4fv(
                this.programInfo.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 8);	
    }
}

class LPiece extends GameObject {
    constructor(programInfo, gl) {
        super(programInfo, gl);

        this.positions = [
            -0.4,  1.0,
            0.2,  1.0,
            -0.4, 0.9,
            0.2, 0.9,
            -0.4,  0.9,
            -0.2, 0.9,
            -0.4, 0.8,
            -0.2, 0.8,
        ];

        this.cx = 0.0 - unitWidth/2;
        this.cy = 1.0 - unitHeight/2;

        this.colors = [
            0.9,  0.2,  0.8,  1.0,
            0.9,  0.2,  0.8,  1.0,
            0.9,  0.2,  0.8,  1.0,
            0.9,  0.2,  0.8,  1.0,
            0.9,  0.2,  0.8,  1.0,
            0.9,  0.2,  0.8,  1.0,
            0.9,  0.2,  0.8,  1.0,
            0.9,  0.2,  0.8,  1.0,
        ];
        
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
    
        mat4.translate(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to translate
            [0.0, 0.0, -5.0]);  // amount to translate

        mat4.scale(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to scale
            [1.0, 2.0, 1.0]);  // amount to scale
    }

    drawObject() {
        const buffers=initBuffers(this.gl, this.positions, this.colors);
    
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                    this.programInfo.attribLocations.vertexPosition);
        }
    
        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const numComponents = 4;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                    this.programInfo.attribLocations.vertexColor);
        }

        // Tell WebGL to use our program when drawing
    
        this.gl.useProgram(this.programInfo.program);
    
        // Set the shader uniforms
    
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix);
            this.gl.uniformMatrix4fv(
                this.programInfo.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 8);	
    }
}

class JPiece extends GameObject {
    constructor(programInfo, gl) {
        super(programInfo, gl);

        this.positions = [
            -0.4,  1.0,
            0.2,  1.0,
            -0.4, 0.9,
            0.2, 0.9,
            0.0,  1.0,
            0.2, 1.0,
            0.0, 0.8,
            0.2, 0.8,
        ];

        this.cx = 0.0 - unitWidth/2;
        this.cy = 1.0 - unitHeight/2;

        this.colors = [
            0.9,  0.7,  0.1,  1.0,
            0.9,  0.7,  0.1,  1.0,
            0.9,  0.7,  0.1,  1.0,
            0.9,  0.7,  0.1,  1.0,
            0.9,  0.7,  0.1,  1.0,
            0.9,  0.7,  0.1,  1.0,
            0.9,  0.7,  0.1,  1.0,
            0.9,  0.7,  0.1,  1.0,
        ];
        
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
    
        mat4.translate(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to translate
            [0.0, 0.0, -5.0]);  // amount to translate

        mat4.scale(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to scale
            [1.0, 2.0, 1.0]);  // amount to scale
    }

    drawObject() {
        const buffers=initBuffers(this.gl, this.positions, this.colors);
    
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                    this.programInfo.attribLocations.vertexPosition);
        }
    
        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const numComponents = 4;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                    this.programInfo.attribLocations.vertexColor);
        }

        // Tell WebGL to use our program when drawing
    
        this.gl.useProgram(this.programInfo.program);
    
        // Set the shader uniforms
    
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix);
            this.gl.uniformMatrix4fv(
                this.programInfo.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 8);	
    }
}

class TPiece extends GameObject {
    constructor(programInfo, gl) {
        super(programInfo, gl);

        this.positions = [
            -0.4,  1.0,
            0.2,  1.0,
            -0.4, 0.9,
            0.2, 0.9,
            -0.2,  1.0,
            0.0, 1.0,
            -0.2, 0.8,
            0.0, 0.8,
        ];

        this.cx = 0.0 - unitWidth/2;
        this.cy = 1.0 - unitHeight/2;

        this.colors = [
            0.1,  1.0,  0.8,  1.0,
            0.1,  1.0,  0.8,  1.0,
            0.1,  1.0,  0.8,  1.0,
            0.1,  1.0,  0.8,  1.0,
            0.1,  1.0,  0.8,  1.0,
            0.1,  1.0,  0.8,  1.0,
            0.1,  1.0,  0.8,  1.0,
            0.1,  1.0,  0.8,  1.0,
        ];
        
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
    
        mat4.translate(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to translate
            [0.0, 0.0, -5.0]);  // amount to translate

        mat4.scale(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to scale
            [1.0, 2.0, 1.0]);  // amount to scale
    }

    drawObject() {
        const buffers=initBuffers(this.gl, this.positions, this.colors);
    
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                    this.programInfo.attribLocations.vertexPosition);
        }
    
        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const numComponents = 4;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(
                    this.programInfo.attribLocations.vertexColor);
        }

        // Tell WebGL to use our program when drawing
    
        this.gl.useProgram(this.programInfo.program);
    
        // Set the shader uniforms
    
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix);
            this.gl.uniformMatrix4fv(
                this.programInfo.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 8);	
    }
}