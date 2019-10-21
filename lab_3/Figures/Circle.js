class Circle extends Figure {
    constructor(center, radius, color) {
        super(center);
        this.name = "Circle";
        this.radius = radius;
        this.color = color;
    }

    initBuffers(){
        this.generateVerticesMatrix();
        this.generateColorMatrix();
        this.initPositionBuffer();
        this.initColorBuffer();
    }

    generateColorMatrix(){
        let colors = [];
        for (let i=0; i < this.vertices.length / 3; i++) {
            colors = colors.concat(this.color);
        }
        this.colors = colors;
    }

    generateVerticesMatrix(){
        let vertices = this.center.toArray();
        for(let theta = 0; theta < 2 * Math.PI; theta += 0.01) {
            let x1  = this.center.x + this.radius * Math.cos(theta);
            let y1 = this.center.y + this.radius * Math.sin(theta);
            let x2  = this.center.x + this.radius * Math.cos(theta + 0.01);
            let y2 = this.center.y + this.radius * Math.sin(theta + 0.01);
            vertices.push(x1, y1, this.center.z, x2, y2, this.center.z)
        }
        vertices.concat(this.center.toArray());
        this.vertices = vertices;
    }
}