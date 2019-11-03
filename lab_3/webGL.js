let gl;
let figures = {};
let shaderProgram;
let mvMatrix = mat4.create();
let pMatrix = mat4.create();
let mvMatrixStack = [];
let strangeTexture;
let sceneTexture;
let currentlyPressedKeys = {};
let yCameraPos = 4, zCameraPos = 24, xCameraPos = 0;

function webGLStart() {
    const canvas = document.getElementById("central_canvas");
    initGL(canvas);
    initShaders();
    figures = {
        cube: new Cube([-5.0, 0.0, 0.0], 0, [5, 1, 5], [0, 0, 0, 255]),
        scene: new Rectangle([0.0, -2, 0.0], 90, [30, 1, 30], [0, 0, 0, 255]),
        net: new Net([5.0, 3.0, 1.0], 0, [8, 8, 1], 15, [66, 1, 22, 255]),
        thingCylinder: new Cylinder([5.0, 2.0, -10.0], 0, [3, 6, 3], [0, 0, 0, 255]),
        thingCube: new Cube([5.0, 6.0, -10.0], 0, [4, 2, 4], [0, 0, 0, 255]),
        blueNetCylinderLines: new NetCylinder([-5.0, 5.0, -10.0], 0, [3, 4, 3], 0, 20, [145, 2, 201, 255]),
        blueNetCylinderCircles: new NetCylinder([-5.0, 5.0, -10.0], 0, [3, 4, 3], 6, 0, [145, 2, 201, 255]),
        greenNetCylinderLines: new NetCylinder([-5.0, 1.0, -10.0], 0, [3, 4, 3], 0, 15, [255, 255, 255, 255]),
        greenNetCylinderCircles: new NetCylinder([-5.0, 1.0, -10.0], 0, [3, 4, 3], 4, 0, [255, 255, 255, 255])
    };

    initBuffers();
    strangeTexture  = initTexture('strange.jpg');
    sceneTexture  = initTexture('scene.jpg');
    gl.clearColor(0.5, 0.5, 0.6, 1.0);
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

function initTexture(url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([255, 255, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel);

    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // Размер не соответствует степени 2.
            // Отключаем MIP'ы и устанавливаем натяжение по краям
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;
    return texture;
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

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
    shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
    shaderProgram.pointLightingColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingColor");
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    let normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

function initBuffers() {
    for (let figureName in figures){
        figures[figureName].initBuffers();
    }
}

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
    mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.lookAt([xCameraPos, yCameraPos, zCameraPos], [0, 0, 0], [0, 1, 0], mvMatrix);

    //light
    var lighting = document.getElementById("lighting").checked;
    gl.uniform1i(shaderProgram.useLightingUniform, lighting);
    if (lighting) {
        gl.uniform3f(
            shaderProgram.ambientColorUniform,
            parseFloat(document.getElementById("ambientR").value),
            parseFloat(document.getElementById("ambientG").value),
            parseFloat(document.getElementById("ambientB").value)
        );

        gl.uniform3f(
            shaderProgram.pointLightingLocationUniform,
            parseFloat(document.getElementById("lightPositionX").value),
            parseFloat(document.getElementById("lightPositionY").value),
            parseFloat(document.getElementById("lightPositionZ").value)
        );

        gl.uniform3f(
            shaderProgram.pointLightingColorUniform,
            parseFloat(document.getElementById("pointR").value),
            parseFloat(document.getElementById("pointG").value),
            parseFloat(document.getElementById("pointB").value)
        );
    }

    //Draw Scene
    mvPushMatrix();
    mat4.translate(mvMatrix, figures.scene.center);
    mat4.scale(mvMatrix, figures.scene.scale);
    mat4.rotate(mvMatrix, degToRad(figures.scene.angle), [0, 1, 0]);
    setBuffersToShaders(figures.scene.vertexPositionBuffer, figures.scene.vertexTextureCoordBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, figures.scene.vertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, figures.scene.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sceneTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_FAN, 0, figures.scene.vertexPositionBuffer.numItems);
    mvPopMatrix();

    //Draw Cube
    mvPushMatrix();
    mat4.translate(mvMatrix, figures.cube.center); // move view
    mat4.scale(mvMatrix, figures.cube.scale);
    setBuffersToShaders(figures.cube.vertexPositionBuffer, figures.cube.vertexTextureCoordBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, figures.cube.vertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, figures.cube.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, strangeTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, figures.cube.vertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, figures.cube.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();

    //Draw strange cube-cylinder thing
    mvPushMatrix();
    mat4.translate(mvMatrix, figures.thingCube.center); // move view
    mat4.scale(mvMatrix, figures.thingCube.scale);
    setBuffersToShaders(figures.thingCube.vertexPositionBuffer, figures.thingCube.vertexTextureCoordBuffer);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, strangeTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, figures.thingCube.vertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, figures.thingCube.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();

    // mvPushMatrix();
    // mat4.translate(mvMatrix, figures.thingCylinder.center);
    // mat4.scale(mvMatrix, figures.thingCylinder.scale);
    // setBuffersToShaders(figures.thingCylinder.vertexPositionBuffer, figures.thingCylinder.vertexTextureCoordBuffer);
    // gl.activeTexture(gl.TEXTURE0);
    // gl.bindTexture(gl.TEXTURE_2D, strangeTexture);
    // gl.uniform1i(shaderProgram.samplerUniform, 0);
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, figures.thingCube.vertexIndexBuffer);
    // setMatrixUniforms();
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, figures.thingCylinder.vertexPositionBuffer.numItems);
    // mvPopMatrix();

    //Draw Net
    gl.lineWidth(3);
    let netTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, netTexture);
    let netColor = new Uint8Array( figures.net.color);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, netColor);
    mvPushMatrix();
    mat4.translate(mvMatrix, figures.net.center);
    mat4.scale(mvMatrix, figures.net.scale);
    setBuffersToShaders(figures.net.vertexPositionBuffer, figures.net.vertexColorBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, figures.net.vertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, figures.net.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.LINES, 0, figures.net.vertexPositionBuffer.numItems);
    mvPopMatrix();

    // //Draw blue NetCylinder
    // gl.lineWidth(1);
    // //Set NetCylinder color
    // let netCylinderTexture = gl.createTexture();
    // gl.bindTexture(gl.TEXTURE_2D, netCylinderTexture);
    // let netCylinderColor = new Uint8Array(figures.blueNetCylinderLines.color);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, netCylinderColor);
    // mvPushMatrix();
    // mat4.translate(mvMatrix, figures.blueNetCylinderLines.center);
    // mat4.scale(mvMatrix, figures.blueNetCylinderLines.scale);
    // setBuffersToShaders(figures.blueNetCylinderLines.vertexPositionBuffer, figures.blueNetCylinderLines.vertexColorBuffer);
    // setMatrixUniforms();
    // gl.drawArrays(gl.LINES, 0, figures.blueNetCylinderLines.vertexPositionBuffer.numItems);
    // mvPopMatrix();
    //
    // mvPushMatrix();
    // mat4.translate(mvMatrix, figures.blueNetCylinderCircles.center);
    // mat4.scale(mvMatrix, figures.blueNetCylinderCircles.scale);
    // setBuffersToShaders(figures.blueNetCylinderCircles.vertexPositionBuffer, figures.blueNetCylinderCircles.vertexColorBuffer);
    // setMatrixUniforms();
    // gl.drawArrays(gl.LINE_LOOP, 0, figures.blueNetCylinderCircles.vertexPositionBuffer.numItems);
    // mvPopMatrix();
    //
    // //Draw green NetCylinder
    // //Set netCylinder color
    // netCylinderTexture = gl.createTexture();
    // gl.bindTexture(gl.TEXTURE_2D, netCylinderTexture);
    // netCylinderColor = new Uint8Array(figures.greenNetCylinderLines.color);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, netCylinderColor);
    //
    // gl.lineWidth(3);
    // mvPushMatrix();
    // mat4.translate(mvMatrix, figures.greenNetCylinderLines.center);
    // mat4.scale(mvMatrix, figures.greenNetCylinderLines.scale);
    // setBuffersToShaders(figures.greenNetCylinderLines.vertexPositionBuffer, figures.greenNetCylinderLines.vertexColorBuffer);
    // setMatrixUniforms();
    // gl.drawArrays(gl.LINES, 0, figures.greenNetCylinderLines.vertexPositionBuffer.numItems);
    // mvPopMatrix();
    //
    // //Draw NetCylinder
    // mvPushMatrix();
    // mat4.translate(mvMatrix, figures.greenNetCylinderCircles.center);
    // mat4.scale(mvMatrix, figures.greenNetCylinderCircles.scale);
    // setBuffersToShaders(figures.greenNetCylinderCircles.vertexPositionBuffer, figures.greenNetCylinderCircles.vertexColorBuffer);
    // setMatrixUniforms();
    // gl.drawArrays(gl.LINE_LOOP, 0, figures.greenNetCylinderCircles.vertexPositionBuffer.numItems);
    // mvPopMatrix();

}

function setBuffersToShaders(posBuffer, textureCoordsBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, posBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER,  textureCoordsBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, textureCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);
}

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
        xCameraPos = xCameraPos < 20 ? xCameraPos + 1 : xCameraPos;
    }
    if (currentlyPressedKeys[39]) {
        // Right cursor key
        xCameraPos = xCameraPos > -20 ? xCameraPos - 1 : xCameraPos;
    }
    if (currentlyPressedKeys[38]) {
        // Up cursor key
        yCameraPos = yCameraPos < 100 ? yCameraPos + 1 : yCameraPos;
    }
    if (currentlyPressedKeys[40]) {
        // Down cursor key
        yCameraPos = yCameraPos > -100 ? yCameraPos - 1 : yCameraPos;
    }
    drawScene();
}