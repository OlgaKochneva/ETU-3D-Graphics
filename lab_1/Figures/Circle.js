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
        for (let i=0; i < this.vertices.length; i++) {
            colors = colors.concat(this.color);
        }
        this.colors = colors;
    }

    generateVerticesMatrix(){
        let vertices = [];

        for(let theta = 0; theta < 2 * Math.PI; theta += 0.01) {
            let x1  = this.center[0] + this.radius * Math.cos(theta);
            let y1 = this.center[1] + this.radius * Math.sin(theta);
            let x2  = this.center[0] + this.radius * Math.cos(theta + 0.01);
            let y2 = this.center[1] + this.radius * Math.sin(theta + 0.01);
            vertices.concat(this.center);
            vertices.push(x1, y1, 0.0, x2, y2, 0)
        }
        this.vertices = vertices;
    }
}