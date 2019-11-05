class Figure {
    constructor(center, angle, scale, color) {
        this.vertexPositionBuffer = gl.createBuffer();
        this.vertexColorBuffer = gl.createBuffer();
        this.vertexIndexBuffer = gl.createBuffer();
        this.vertexTextureCoordBuffer = gl.createBuffer();
        this.vertexNormalBuffer = gl.createBuffer();
        this.vertices = [];
        this.colors = [];
        this.indices = [];
        this.vertexNormales = [];
        this.textureCoords = [];
        this.center = center;
        this.angle = angle;
        this.scale = scale;
        this.color = color;
    }

    initPositionBuffer(){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        this.vertexPositionBuffer.itemSize = 3;
        this.vertexPositionBuffer.numItems = this.vertices.length / 3;
    }

    initTextureCoordsBuffer(){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);
        this.vertexTextureCoordBuffer.itemSize = 2;
        this.vertexTextureCoordBuffer.numItems = this.textureCoords / 2;
    }
    initColorBuffer(){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        this.vertexColorBuffer.itemSize = 4;
        this.vertexColorBuffer.numItems = this.colors.length / 4;
    }

    initIndexBuffer(){
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        this.vertexIndexBuffer.itemSize = 1;
        this.vertexIndexBuffer.numItems = this.indices.length;
    }

    initNormalesBuffer(){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormales), gl.STATIC_DRAW);
        this.vertexNormalBuffer.itemSize = 3;
        this.vertexNormalBuffer.numItems = this.vertexNormales / 3;
    }

}