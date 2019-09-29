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

function initBuffers() {
    for(let i = 0; i < figures.length; i++){
        figures[i].initBuffers();
    }
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

    mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
    setBuffersToShaders(figures[0].getPositionBuffer(), figures[0].getColorBuffer());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, figures[0].getPositionBuffer().numItems);

    mat4.translate(mvMatrix, [-3.0, -2.0, 0.0]);
    setBuffersToShaders(figures[2].getPositionBuffer(), figures[2].getColorBuffer());
    gl.drawArrays(gl.TRIANGLE_FAN, 0, figures[2].getPositionBuffer().numItems);

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
    figures = [new Rectangle([0.0,0.0,0.0], 2, 4, [1.0, 0.0, 0.5, 1.0]),
               new Net([0.5, 0.5, 0.0],1, 1, 10, [0.0, 1.0, 0.0, 1.0]),
               new Circle([0.5, 0.5, 0.0], 1, [1.0, 0.0, 0.0, 1.0])
    ];
    initShaders();
    initBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();
}

function changeColor() {
    let cur_figure = document.getElementById("cur_figure").value;
    let color_list = document.getElementsByName("color");
    let color = [];
    for (let i = 0; i < color_list.length; i++) {
        color.push(color_list[i].value / 255)
    }
    gl.lineWidth(document.getElementById("line_width").value);
    for (let i = 0; i < figures.length; i++){
        if (cur_figure == figures[i].name){
            figures[i].color = color;
            figures[i].initBuffers();
        }
    }
    drawScene();
}

class Figure {
    constructor(center) {
        this.vertexPositionBuffer = gl.createBuffer();
        this.vertexColorBuffer = gl.createBuffer();
        this.vertices = [];
        this.colors = [];
        this.center = center;
    }

    initPositionBuffer(){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        this.vertexPositionBuffer.itemSize = 3;
        this.vertexPositionBuffer.numItems = this.vertices.length / 3;
    }

    initColorBuffer(){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        this.vertexColorBuffer.itemSize = 4;
        this.vertexColorBuffer.numItems = this.colors.length / 4;
    }

    getPositionBuffer(){
        return this.vertexPositionBuffer;
    }

    getColorBuffer(){
        return this.vertexColorBuffer;
    }
}

class Circle extends Figure {
    constructor(center, radius, color) {
        super(center);
        this.name = "Circle";
        this.radius = radius;
        this.color = color;
    }

    initBuffers(){
        this.generateVerticesMatrix();
        this.generateColorMatrix();
        this.initPositionBuffer();
        this.initColorBuffer();
    }

    generateColorMatrix(){
        let colors = [];
        for (let i=0; i < this.vertices.length; i++) {
            colors = colors.concat(this.color);
        }
        this.colors = colors;
    }

    generateVerticesMatrix(){
        let vertices = [];

        for(let theta = 0; theta < 2 * Math.PI; theta += 0.01) {
            let x1  = this.center[0] + this.radius * Math.cos(theta);
            let y1 = this.center[1] + this.radius * Math.sin(theta);
            let x2  = this.center[0] + this.radius * Math.cos(theta + 0.01);
            let y2 = this.center[1] + this.radius * Math.sin(theta + 0.01);
            vertices.concat(this.center);
            vertices.push(x1, y1, 0.0, x2, y2, 0)
        }
        this.vertices = vertices;
    }
}

class Rectangle extends Figure {
    constructor(center, a, b, color) {
        super(center);
        this.name = "Rectangle";
        this.aSide = a;
        this.bSide = b;
        this.color = color;
    }

    initBuffers(){
        this.generateVerticesMatrix();
        this.generateColorMatrix();
        this.initPositionBuffer();
        this.initColorBuffer();
    }
    generateColorMatrix(){
        let colors = [];
        for (let i=0; i < 4; i++) {
            colors = colors.concat(this.color);
        }
        this.colors = colors;
    }

    generateVerticesMatrix(){
        this.vertices = [
            this.aSide / 2, this.bSide / 2, 0.0,
            -this.aSide / 2, this.bSide / 2, 0.0,
            this.aSide / 2, -this.bSide / 2, 0.0,
            -this.aSide / 2, -this.bSide / 2, 0.0
        ];
    }
}


class Net extends Figure {
    constructor(center, height, width, freq, color) {
        super(center);
        this.name = "Net";
        this.height = height;
        this.width = width;
        this.freq = freq+1;
        this.color = color;
    }

    initBuffers(){
        this.generateVerticesMatrix();
        this.generateColorMatrix();
        this.initPositionBuffer();
        this.initColorBuffer();
    }

    generateColorMatrix(){
        let colors = [];
        for (let i=0; i < this.freq * 4; i++) {
            colors = colors.concat(this.color);
        }
        this.colors = colors;
    }

    generateVerticesMatrix(){
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
        this.vertices = vertices;
    }
}
