class Cylinder extends Figure {
    constructor(center, angle, scale, color) {
        super(center, angle, scale, color);
        this.radius = 1;
        this.height = 1/2;
        this.thetaOffset = 0.01
    }

    initBuffers() {
        this.generateVerticesMatrix();
        this.generateTextureCoords();

        this.initPositionBuffer();
        this.initTextureCoordsBuffer();
    }

    generateTextureCoords() {
        for(let theta = 0; theta <= 2 * Math.PI; theta += this.thetaOffset) {
            this.textureCoords.push(theta /  (2 * Math.PI), 1.0, (theta + this.thetaOffset) /  (2 * Math.PI), 1.0);
            this.textureCoords.push(theta /  (2 * Math.PI), 0.0, (theta + this.thetaOffset) /  (2 * Math.PI), 0.0);
        }
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
        for(let theta = 0; theta <= 2 * Math.PI; theta += this.thetaOffset) {
            let x1  = this.radius * Math.cos(theta);
            let z1 =  this.radius * Math.sin(theta);
            let x2  =  this.radius * Math.cos(theta + this.thetaOffset);
            let z2 = this.radius * Math.sin(theta + this.thetaOffset);
            this.vertices.push(x1, this.height, z1, x2, this.height, z2);
            this.vertices.push(x1, -this.height, z1, x2, -this.height, z2);
        }
    }
}
