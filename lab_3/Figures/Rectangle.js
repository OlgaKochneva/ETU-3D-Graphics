class Rectangle extends Figure {
    constructor(center, angle, scale, color) {
        super(center, angle, scale);
        this.name = "Rectangle";
        this.x = 1;
        this.y = 1;
        this.z = 1;
        this.color = color;
    }

    initBuffers() {
        this.generateVerticesMatrix();
        this.generateColorMatrix();
        this.initPositionBuffer();
        this.initColorBuffer();
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
        let vertices = [0.0, 0.0, 0.0];
        vertices = vertices.concat([
            this.x, -this.y, -this.z,
            this.x, -this.y, this.z,
            -this.x, -this.y, this.z,
            -this.x, -this.y, -this.z,
            this.x, -this.y, -this.z
        ]);
        vertices = vertices.concat([0.0, 0.0, 0.0]);
        this.vertices = vertices;
    }
}
