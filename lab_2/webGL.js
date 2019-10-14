let gl;
let figures = [];
let shaderProgram;
let mvMatrix = mat4.create();
let posMatrix = mat4.create();
let viewMatrix = mat4.create();
let pMatrix = mat4.create();

function webGLStart() {
    const canvas = document.getElementById("central_canvas");
    initGL(canvas);
    initShaders();
    figures = [new Rectangle(new Point3(0.0, 0.0, 0.0), 2, 2, [0.0, 0.0, 0.0, 1.0]),
        new Net(new Point3(0.0, 0.0, 0.0), 4, 4, 20, [1.0, 1.0, 1.0, 1.0]),
        new Circle(new Point3(0.0, -0.0, 0.0), 3, [1.0, 0.0, 0.5, 1.0])
    ];
    initBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 0.5);
    gl.lineWidth(3);
    gl.enable(gl.DEPTH_TEST);
    document.onkeyup = handleKeyUp;
    document.onkeydown = handleKeyDown;

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

function moveCamera(){
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

let mvMatrixStack = [];

function mvPushMatrix() {
    let copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function drawScene() {
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (document.getElementById("ortho").checked){
        mat4.ortho(-gl.viewportWidth / 100, gl.viewportWidth/100, -gl.viewportHeight/100, gl.viewportHeight/100, 0.1, 100.0, pMatrix);
    }
    else {
        mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    }

    mat4.lookAt([xCameraPos, yCameraPos, zCameraPos], [0, 0, 0], [0, 1, 0], mvMatrix);
    //Draw Rectangle
    mvPushMatrix();
    //mat4.translate(mvMatrix, [0.0, 0.0, -50.0]);
    mat4.scale(mvMatrix, [3, 3, 1]);
    mat4.rotate(mvMatrix, degToRad(45), [1, 1, 1]);
    //mat4.multiply(viewMatrix, posMatrix, mvMatrix);
    setBuffersToShaders(figures[0].vertexPositionBuffer, figures[0].vertexColorBuffer);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, figures[0].vertexPositionBuffer.numItems);
    mvPopMatrix();

    //Draw Net
    mvPushMatrix();
    //mat4.translate(mvMatrix, [3.0, 0.0, -10.0]);
    mat4.scale(mvMatrix, [2, 2, 1]);
    mat4.rotate(mvMatrix, degToRad(-80), [0, 1, 0]);
    setBuffersToShaders(figures[1].vertexPositionBuffer, figures[1].vertexColorBuffer);
    gl.drawArrays(gl.LINES, 0, figures[1].vertexPositionBuffer.numItems);
    mvPopMatrix();

    //Draw Circle
    mvPushMatrix();
    //mat4.translate(mvMatrix, [0.0, -5.0, -20.0]); // move view
    mat4.scale(mvMatrix, [2, 2, 1]);
    mat4.rotate(mvMatrix, degToRad(60), [1, 0, 0]);
    setBuffersToShaders(figures[2].vertexPositionBuffer, figures[2].vertexColorBuffer);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, figures[2].vertexPositionBuffer.numItems);
    mvPopMatrix();

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

let currentlyPressedKeys = {};
let yCameraPos = 0, zCameraPos = 0, xCameraPos = 0;

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
    handleKeys();
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
    if (currentlyPressedKeys[33]) {
        // Page Up
        zCameraPos = zCameraPos < 100 ? zCameraPos + 1 : zCameraPos;
    }
    if (currentlyPressedKeys[34]) {
        // Page Down
        zCameraPos = zCameraPos > -100 ? zCameraPos - 1 : zCameraPos;
    }
    if (currentlyPressedKeys[37]) {
        // Left cursor key
        xCameraPos = xCameraPos < 10 ? xCameraPos + 1 : xCameraPos;
    }
    if (currentlyPressedKeys[39]) {
        // Right cursor key
        xCameraPos = xCameraPos > -10 ? xCameraPos - 1 : xCameraPos;
    }
    if (currentlyPressedKeys[38]) {
        // Up cursor key
        yCameraPos = yCameraPos < 10 ? yCameraPos + 1 : yCameraPos;
    }
    if (currentlyPressedKeys[40]) {
        // Down cursor key
        yCameraPos = yCameraPos > -10 ? yCameraPos - 1 : yCameraPos;
    }
    drawScene();
}