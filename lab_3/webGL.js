let gl;
let figures = [];
let shaderProgram;
let mvMatrix = mat4.create();
let pMatrix = mat4.create();

function webGLStart() {
    const canvas = document.getElementById("central_canvas");
    initGL(canvas);
    initShaders();
    figures = [
        new Cube([-5.0, 0.0, 0.0], 0, [5, 1, 5], [0.0, 0.0, 0.0, 1.0]),
        new Rectangle([0.0, -1.0, 0.0], 90, [100, 1, 100], [0.0, 0.0, 0.0, 1.0]),
        new Net([5.0, 3.0, 1.0], 0, [8, 8, 1], 15, [128.0/255, 5.0/255, 48/255, 1.0]),
        new Cylinder([5.0, 2.0, -10.0], 0, [3, 6, 3], [0.0, 0.0, 0.0, 1.0]),
        new Cube([5.0, 6.0, -10.0], 0, [4, 2, 4], [0.0, 0.0, 0.0, 1.0]),
        new NetCylinder([-5.0, 5.0, -10.0], 0, [3, 4, 3], 0, 20, [0.0, 0.0, 1.0, 1.0]),
        new NetCylinder([-5.0, 5.0, -10.0], 0, [3, 4, 3], 6, 0, [0.0, 0.0, 1.0, 1.0]),
        new NetCylinder([-5.0, 1.0, -10.0], 0, [3, 4, 3], 0, 15, [37/255, 186/255, 65/255, 1.0]),
        new NetCylinder([-5.0, 1.0, -10.0], 0, [3, 4, 3], 4, 0, [37/255, 186/255, 65/255, 1.0])
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

    //Draw Scene
    mvPushMatrix();
    mat4.translate(mvMatrix, figures[1].center);
    mat4.scale(mvMatrix, figures[1].scale);
    mat4.rotate(mvMatrix, degToRad(figures[1].angle), [0, 1, 0]);
    setBuffersToShaders(figures[1].vertexPositionBuffer, figures[1].vertexColorBuffer);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_FAN, 0, figures[1].vertexPositionBuffer.numItems);
    mvPopMatrix();

    //Draw Cube
    mvPushMatrix();
    mat4.translate(mvMatrix, figures[0].center); // move view
    mat4.scale(mvMatrix, figures[0].scale);

    setBuffersToShaders(figures[0].vertexPositionBuffer, figures[0].vertexColorBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, figures[0].vertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, figures[0].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();

    //Draw Cube2
    mvPushMatrix();
    mat4.translate(mvMatrix, figures[4].center); // move view
    mat4.scale(mvMatrix, figures[4].scale);

    setBuffersToShaders(figures[4].vertexPositionBuffer, figures[4].vertexColorBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, figures[4].vertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, figures[4].vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();

    //Draw Net
    mvPushMatrix();
    mat4.translate(mvMatrix, figures[2].center);
    mat4.scale(mvMatrix, figures[2].scale);
    //mat4.rotate(mvMatrix, degToRad(-80), [0, 1, 0]);
    setBuffersToShaders(figures[2].vertexPositionBuffer, figures[2].vertexColorBuffer);
    setMatrixUniforms();
    gl.drawArrays(gl.LINES, 0, figures[2].vertexPositionBuffer.numItems);
    mvPopMatrix();

    //Draw Cylinder
    mvPushMatrix();
    mat4.translate(mvMatrix, figures[3].center);
    mat4.scale(mvMatrix, figures[3].scale);
    //mat4.rotate(mvMatrix, degToRad(-80), [0, 1, 0]);
    setBuffersToShaders(figures[3].vertexPositionBuffer, figures[3].vertexColorBuffer);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_FAN, 0, figures[3].vertexPositionBuffer.numItems);
    mvPopMatrix();

    gl.lineWidth(1);
    //Draw NetCylinder
    mvPushMatrix();
    mat4.translate(mvMatrix, figures[5].center);
    mat4.scale(mvMatrix, figures[5].scale);
    //mat4.rotate(mvMatrix, degToRad(-80), [0, 1, 0]);
    setBuffersToShaders(figures[5].vertexPositionBuffer, figures[5].vertexColorBuffer);
    setMatrixUniforms();
    gl.drawArrays(gl.LINES, 0, figures[5].vertexPositionBuffer.numItems);
    mvPopMatrix();

    //Draw NetCylinder
    mvPushMatrix();
    mat4.translate(mvMatrix, figures[6].center);
    mat4.scale(mvMatrix, figures[6].scale);
    //mat4.rotate(mvMatrix, degToRad(-80), [0, 1, 0]);
    setBuffersToShaders(figures[6].vertexPositionBuffer, figures[6].vertexColorBuffer);
    setMatrixUniforms();
    gl.drawArrays(gl.LINE_LOOP, 0, figures[6].vertexPositionBuffer.numItems);
    mvPopMatrix();

    gl.lineWidth(3);
    //Draw NetCylinder
    mvPushMatrix();
    mat4.translate(mvMatrix, figures[7].center);
    mat4.scale(mvMatrix, figures[7].scale);
    //mat4.rotate(mvMatrix, degToRad(-80), [0, 1, 0]);
    setBuffersToShaders(figures[7].vertexPositionBuffer, figures[7].vertexColorBuffer);
    setMatrixUniforms();
    gl.drawArrays(gl.LINES, 0, figures[7].vertexPositionBuffer.numItems);
    mvPopMatrix();

    //Draw NetCylinder
    mvPushMatrix();
    mat4.translate(mvMatrix, figures[8].center);
    mat4.scale(mvMatrix, figures[8].scale);
    //mat4.rotate(mvMatrix, degToRad(-80), [0, 1, 0]);
    setBuffersToShaders(figures[8].vertexPositionBuffer, figures[8].vertexColorBuffer);
    setMatrixUniforms();
    gl.drawArrays(gl.LINE_LOOP, 0, figures[8].vertexPositionBuffer.numItems);
    mvPopMatrix();

}

function setBuffersToShaders(pos_buffer, color_buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, pos_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pos_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, color_buffer.itemSize, gl.FLOAT, false, 0, 0);
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
let yCameraPos = 4, zCameraPos = 24, xCameraPos = 0;

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
        xCameraPos = xCameraPos > -20 ? xCameraPos - 1 : xCameraPos;
    }
    if (currentlyPressedKeys[38]) {
        // Up cursor key
        yCameraPos = yCameraPos < 20 ? yCameraPos + 1 : yCameraPos;
    }
    if (currentlyPressedKeys[40]) {
        // Down cursor key
        yCameraPos = yCameraPos > -10 ? yCameraPos - 1 : yCameraPos;
    }
    drawScene();
}