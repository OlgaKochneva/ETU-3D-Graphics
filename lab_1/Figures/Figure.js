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