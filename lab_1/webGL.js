let gl;
let figures = [];
let shaderProgram;

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    const shaderScript = document.getElementById(id);
    if (!shaderScript) {
        alert('No shader programme')
        return null;
    }

    let shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, shaderScript.text);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


function initShaders() {
    const fragmentShader = getShader(gl, "shader-fs");
    const vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}


const mvMatrix = mat4.create();
const pMatrix = mat4.create();

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}



//let triangleVertexPositionBuffer;
//let triangleVertexColorBuffer;
//let squareVertexPositionBuffer;
//let squareVertexColorBuffer;

function initBuffers() {
    // triangleVertexPositionBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    // let vertices = [
    //     0.0,  1.0,  0.0,
    //     -1.0, -1.0,  0.0,
    //     1.0, -1.0,  0.0
    // ];
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // triangleVertexPositionBuffer.itemSize = 3;
    // triangleVertexPositionBuffer.numItems = 3;
    //
    // triangleVertexColorBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    // var colors = [
    //     1.0, 0.0, 0.0, 1.0,
    //     0.0, 1.0, 0.0, 1.0,
    //     0.0, 0.0, 1.0, 1.0
    // ];
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    // triangleVertexColorBuffer.itemSize = 4;
    // triangleVertexColorBuffer.numItems = 3;

    // for(let i = 0; i < figures.length; i++){
    //     figures[i] =
    // }
    figures[0].initPositionBuffer(figures[0].getVerticesMatrix(), 3, 4);
    figures[0].initColorBuffer(figures[0].getColorMatrix(), 4, 4);

    figures[1].initPositionBuffer(figures[1].getVerticesMatrix(), 3, figures[1].freq * 4);
    figures[1].initColorBuffer(figures[1].getColorMatrix(), 4, figures[1].freq * 4);
}


function drawScene() {
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

     mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
    setBuffersToShaders(figures[1].getPositionBuffer(), figures[1].getColorBuffer());
    gl.drawArrays(gl.LINES, 0, figures[1].getPositionBuffer().numItems);
    // setBuffersToShaders(triangleVertexPositionBuffer, triangleVertexColorBuffer);
    // gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);


    mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
    setBuffersToShaders(figures[0].getPositionBuffer(), figures[0].getColorBuffer());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, figures[0].getPositionBuffer().numItems);

}

function setBuffersToShaders(pos_buffer, color_buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, pos_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pos_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, color_buffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
}


function webGLStart() {
    const canvas = document.getElementById("central_canvas");
    initGL(canvas);
    figures = [new Rectangle(2, 4, [1.0, 0.0, 0.5, 1.0]),
               new Net(1, 1, 10, [0.0, 1.0, 0.0, 1.0])];
    initShaders();
    initBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();
}

function changeColor() {

}

class Figure {
    constructor() {
        this.vertexPositionBuffer = gl.createBuffer();
        this.vertexColorBuffer = gl.createBuffer();
    }

    initPositionBuffer(vertices, itemSize, numItems){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.vertexPositionBuffer.itemSize = itemSize;
        this.vertexPositionBuffer.numItems = numItems;
    }

    initColorBuffer(colors, itemSize, numItems){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        this.vertexColorBuffer.itemSize = itemSize;
        this.vertexColorBuffer.numItems = numItems;
    }

    getPositionBuffer(){
        return this.vertexPositionBuffer;
    }

    getColorBuffer(){
        return this.vertexColorBuffer;
    }
}

class Rectangle extends Figure {
    constructor(a, b, color) {
        super();
        this.aSide = a;
        this.bSide = b;
        this.color = color;
    }

    getColorMatrix(){
        let colors = [];
        for (let i=0; i < 4; i++) {
            colors = colors.concat(this.color);
        }
        return colors;
    }

    getVerticesMatrix(){
        return [
            this.aSide / 2,  this.bSide / 2,  0.0,
            -this.aSide / 2,  this.bSide / 2,  0.0,
            this.aSide / 2, -this.bSide / 2,  0.0,
            -this.aSide / 2, -this.bSide / 2,  0.0
        ];
    }
}


class Net extends Figure {
    constructor(height, width, freq, color) {
        super();
        this.height = height;
        this.width = width;
        this.freq = freq+1;
        this.color = color;
        this.center = [0.5, 0.5, 0.0];
    }

    getColorMatrix(){
        let colors = [];
        for (let i=0; i < this.freq * 4; i++) {
            colors = colors.concat(this.color);
        }
        return colors;
    }

    getVerticesMatrix(){
        let vertices = [];
        let vertical_offset = this.height / (this.freq - 1);
        let horizontal_offset = this.width / (this.freq - 1);
        for(let i = 0; i < this.freq; i ++) {
            let left_point = [this.center[0] - this.width / 2, (this.center[1] + this.height / 2) - i * vertical_offset, 0.0];
            let right_point = [this.center[0] + this.width / 2, (this.center[1] + this.height / 2) - i * vertical_offset, 0.0];
            vertices = vertices.concat(left_point.concat(right_point));
            let top_point = [this.center[0] - this.width / 2 + i * horizontal_offset, this.center[1] + this.height / 2, 0.0];
            let low_point = [this.center[0] - this.width / 2 + i * horizontal_offset, this.center[1] - this.height / 2, 0.0];
            vertices = vertices.concat(top_point.concat(low_point));
        }
        return vertices;
    }
}

class Line extends Figure {
    constructor(a, b ,color) {
        super();
        this.pointA = a;
        this.pointB = b;
        this.color = color;
    }

    getColorMatrix(){
        let colors = [];
        for (let i=0; i < 4; i++) {
            colors = colors.concat(this.color);
        }
        return colors;
    }

    getVerticesMatrix(){
        return this.pointA.concat(this.pointB);
    }
}