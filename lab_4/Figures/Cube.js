class Cube extends Figure {
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
         this.generateIndexesMatrix();

         this.initPositionBuffer();
         this.initTextureCoordsBuffer();
         this.initIndexBuffer();
         this.initNormalesBuffer();
    }

    generateNormalesMatrix(){
        this.vertexNormales = [
            // Front face
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,

            // Back face
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,

            // Top face
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,

            // Bottom face
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,

            // Right face
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,

            // Left face
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
        ];
    }

    generateTextureCoords(){
        this.textureCoords = [
            // Front face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            // Back face
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,

            // Top face
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,

            // Bottom face
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,

            // Right face
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,

            // Left face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ];
    }
    // Special color like on picture
    generateColorMatrix() {
        let colors = [];
        for (let i=0; i < this.vertices.length / 3; i++) {
            colors = colors.concat(this.color);
        }
        this.colors = colors;
    }

    generateVerticesMatrix() {
        this.vertices = [
            // Front face
            -this.x, -this.y, this.z,
            this.x, -this.y, this.z,
            this.x, this.y, this.z,
            -this.x, this.y, this.z,

            // Back face
            -this.x, -this.y, -this.z,
            -this.x, this.y, -this.z,
            this.x, this.y, -this.z,
            this.x, -this.y, -this.z,

            // Top face
            -this.x, this.y, -this.z,
            -this.x, this.y, this.z,
            this.x, this.y, this.z,
            this.x, this.y, -this.z,

            // Bottom face
            -this.x, -this.y, -this.z,
            this.x, -this.y, -this.z,
            this.x, -this.y, this.z,
            -this.x, -this.y, this.z,

            // Right face
            this.x, -this.y, -this.z,
            this.x, this.y, -this.z,
            this.x, this.y, this.z,
            this.x, -this.y, this.z,

            // Left face
            -this.x, -this.y, -this.z,
            -this.x, -this.y, this.z,
            -this.x, this.y, this.z,
            -this.x, this.y, -this.z,
        ];
    }

    generateIndexesMatrix(){
        this.indices = [
            0, 1, 2,      0, 2, 3,    // Front face
            4, 5, 6,      4, 6, 7,    // Back face
            8, 9, 10,     8, 10, 11,  // Top face
            12, 13, 14,   12, 14, 15, // Bottom face
            16, 17, 18,   16, 18, 19, // Right face
            20, 21, 22,   20, 22, 23  // Left face
        ]
    }
}