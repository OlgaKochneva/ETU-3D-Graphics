class NetCylinder extends Figure {
    constructor(center, angle, scale, vertical_freq, horizontal_freq, color) {
        super(center, angle, scale);
        this.radius = 1;
        this.height = 1 / 2;
        this.vertical_freq = vertical_freq;
        this.horizontal_freq = horizontal_freq;
        this.color = color;
    }
    initBuffers() {
        this.generateVerticesMatrix();
        this.generateColorMatrix();

        this.initNormalesBuffer();
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
        let vertices = [];
        if (this.vertical_freq === 0){
            thetaOffset = 2 * Math.PI / this.horizontal_freq;
            for(let theta = 0; theta < 2 * Math.PI; theta += thetaOffset) {
                let x1  = this.radius * Math.cos(theta);
                let z1 =  this.radius * Math.sin(theta);
                vertices.push(x1, this.height, z1, x1, -this.height, z1);
                this.vertexNormales.push(0.0, 0.0, 1.0, 0.0, 0.0, 1.0);
            }
        }
        else {
            let heightOffset = this.height / this.vertical_freq;
            for (let height = -this.height; height < this.height; height += heightOffset){
                for(let theta = 0; theta < 2 * Math.PI; theta += thetaOffset) {
                    let x1  = this.radius * Math.cos(theta);
                    let z1 =  this.radius * Math.sin(theta);
                    //top point
                    vertices.push(x1, height, z1);
                    this.vertexNormales.push(0.0, 0.0, 1.0);

                }
            }
        }

        this.vertices = vertices;

    }
}
