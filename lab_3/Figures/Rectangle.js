class Rectangle extends Figure {
    constructor(center, angle, scale, color) {
        super(center, angle, scale, color);
        this.x = 1;
        this.y = 1;
        this.z = 1;
    }

    initBuffers() {
        this.generateVerticesMatrix();
        this.generateTextureCoords();
        this.generateNormalesMatrix();

        this.initPositionBuffer();
        this.initTextureCoordsBuffer();
        this.initNormalesBuffer();
    }

    // Special color like on picture
    generateColorMatrix(){
        let colors = [1.0, 1.0, 1.0, 1.0];

        for (let i=0; i < this.vertices.length/3 - 2; i++) {
            colors = colors.concat(this.color);
        }
        colors = colors.concat([1.0, 1.0, 1.0, 1.0]);
        this.colors = colors;
    }

    generateVerticesMatrix() {
        this.vertices = [
            -this.x, this.y, -this.z,
            -this.x, this.y, this.z,
            this.x, this.y, this.z,
            this.x, this.y, -this.z
        ];
    }

    generateNormalesMatrix(){
        this.vertexNormales = [
            // Top face
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
        ];
    }

    generateTextureCoords(){
        this.textureCoords = [
            // Front face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ];
    }
}
