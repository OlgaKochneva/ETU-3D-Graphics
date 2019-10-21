class Cube extends Figure {
    constructor(center, a, b, color) {
        super(center);
        this.name = "Cube";
        this.x = a / 2;
        this.y = b / 2;
        this.z = 1 / 2;
        this.color = color;
    }

    initBuffers() {
         this.generateVerticesMatrix();
         this.generateColorMatrix();
         this.generateIndexesMatrix();

         this.initPositionBuffer();
         this.initColorBuffer();
         this.initIndexBuffer();
    }

    // Special color like on picture
    generateColorMatrix() {
        let colors = [
            [1.0, 0.0, 0.0, 1.0],     // Front face
            [1.0, 1.0, 0.0, 1.0],     // Back face
            [0.0, 1.0, 0.0, 1.0],     // Top face
            [1.0, 0.5, 0.5, 1.0],     // Bottom face
            [1.0, 0.0, 1.0, 1.0],     // Right face
            [0.0, 0.0, 1.0, 1.0],     // Left face
        ];
        let unpackedColors = [];
        for (let i in colors) {
            let color = colors[i];
            for (let j=0; j < 4; j++) {
                unpackedColors = unpackedColors.concat(color);
            }
        }
        this.colors = unpackedColors;
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