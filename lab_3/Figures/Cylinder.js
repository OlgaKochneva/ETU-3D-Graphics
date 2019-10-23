class Cylinder extends Figure {
    constructor(center, angle, scale, color) {
        super(center, angle, scale);
        this.name = "Cylinder";
        this.radius = 1;
        this.height = 1/2;
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
        let colors = [];
        for (let i=0; i < this.vertices.length / 3; i++) {
            colors = colors.concat(this.color);
        }
        this.colors = colors;
    }

    generateVerticesMatrix() {
        let thetaOffset = 0.01;
        let vertices = [0.0, 0.0, 0.0];
        for(let theta = 0; theta < 2 * Math.PI; theta += thetaOffset) {
            let x1  = this.radius * Math.cos(theta);
            let z1 =  this.radius * Math.sin(theta);
            let x2  =  this.radius * Math.cos(theta + thetaOffset);
            let z2 = this.radius * Math.sin(theta + thetaOffset);
            vertices.push(x1, this.height, z1, x2, this.height, z2)
            vertices.push(x1, -this.height, z1, x2, -this.height, z2)
        }
        this.vertices = vertices;
    }
}
