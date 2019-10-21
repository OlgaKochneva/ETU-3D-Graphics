class Rectangle extends Figure {
    constructor(center, a, b, color) {
        super(center);
        this.name = "Rectangle";
        this.x = a / 2;
        this.y = b / 2;
        this.z = 1 / 2;
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
        let vertices = this.center.toArray();
        vertices = vertices.concat([
            this.x, -this.y, -this.z,
            this.x, -this.y, this.z,
            -this.x, -this.y, this.z,
            -this.x, -this.y, -this.z,
            this.x, -this.y, -this.z
        ]);
        vertices = vertices.concat(this.center.toArray());
        this.vertices = vertices;
    }
}
