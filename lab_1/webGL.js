let gl;
let figures = [];
let shaderProgram;
const mvMatrix = mat4.create();
const pMatrix = mat4.create();

function webGLStart() {
    const canvas = document.getElementById("central_canvas");
    initGL(canvas);
    initShaders();
    figures = [new Rectangle([0.0, 0.0, 0.0], 1, 3, [1.0, 0.0, 0.5, 1.0]),
        new Net([2.0, 2.0, 0.0], 1, 1, 10, [0.0, 1.0, 0.0, 1.0]),
        new Circle([-1.0, -1.0, 0.0], 1, [1.0, 0.0, 0.0, 1.0])
    ];
    initBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();
}

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
        alert('No shader programme');
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

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function initBuffers() {
    for (let i = 0; i < figures.length; i++) {
        figures[i].initBuffers();
    }
}

function drawScene() {
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

    //Draw Rectangle
    mat4.translate(mvMatrix, [0.0, 0.0, -7.0]);
    setBuffersToShaders(figures[0].getPositionBuffer(), figures[0].getColorBuffer());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, figures[0].getPositionBuffer().numItems);

    //Draw Net
    mat4.translate(mvMatrix, [-0.5, 0.0, 0.0]); // move view
    setBuffersToShaders(figures[1].getPositionBuffer(), figures[1].getColorBuffer());
    gl.drawArrays(gl.LINES, 0, figures[1].getPositionBuffer().numItems);

    //Draw Circle
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

function update_scene() {
    let cur_figure = document.getElementById("cur_figure").value;
    let color_list = document.getElementsByName("color");
    let color = [];
    for (let i = 0; i < color_list.length; i++) {
        color.push(color_list[i].value / 255)
    }
    gl.lineWidth(document.getElementById("line_width").value);
    for (let i = 0; i < figures.length; i++) {
        if (cur_figure == figures[i].name) {
            figures[i].color = color;
            figures[i].initBuffers();
        }
    }
    drawScene();
}

