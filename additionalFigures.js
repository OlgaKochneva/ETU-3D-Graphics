class Net {
    constructor(freq) {
        this.height = 1/2;
        this.width = 1/2;
        this.freq = freq;
        this.vertices = [];
        this.normals = [];
        this.textureCoords = [];
        this.indices = [];
    }

    generateBufferInfo(){
        this.generateVerticesMatrix();
        this.generateNormalesMatrix();
        this.generateTextureMatrix();
        this.generateIndicesMatrix();
    }

    generateTextureMatrix(){
        for (let i = 0; i < this.vertices.length / 3; i++) {
            this.textureCoords.push([0.0, 0.0]);
        }
    }

    generateNormalesMatrix(){
        for(let i = 0; i < this.vertices.length / 3; i++) {
            this.normals.push(0.0,  0.0,  1.0);
        }
    }

    generateVerticesMatrix(){
        let indices = 0;
        for(let i = 0; i < this.freq + 2; i++) {
            //left_point
            this.vertices.push(-this.width, this.height -  i / this.freq, 0);
            this.indices.push(indices++);
            //right_point
            this.vertices.push(this.width, this.height -  i / this.freq, 0);
            this.indices.push(indices++);
            //top_point
            this.vertices.push(-this.width + i / this.freq, this.height, 0);
            this.indices.push(indices++);
            //low_point
            this.vertices.push(-this.width +  i / this.freq, -this.height, 0);
            this.indices.push(indices++);
        }
    }

    generateIndicesMatrix() {

    }
}

class NetCylinder{
    constructor(vertical_freq, horizontal_freq) {
        this.radius = 1;
        this.height = 1 / 2;
        this.vertical_freq = vertical_freq;
        this.horizontal_freq = horizontal_freq;

        this.vertices = [];
        this.normals = [];
        this.textureCoords = [];
        this.indices = [];

    }
    generateBufferInfo() {
        this.generateVerticesMatrix();
        this.generateTextureMatrix();
    }

    // Special color like on picture
    generateTextureMatrix(){
        for (let i=0; i < this.vertices.length / 3; i++) {
            this.textureCoords.push([0.0, 0.0]);
        }
    }

    generateVerticesMatrix() {
        let thetaOffset = 0.2;
        let indices = 0;
        if (this.vertical_freq === 0){
            thetaOffset = 2 * Math.PI / this.horizontal_freq;
            for(let theta = 0; theta < 2 * Math.PI; theta += thetaOffset) {
                let x1  = this.radius * Math.cos(theta);
                let z1 =  this.radius * Math.sin(theta);
                this.vertices.push(x1, this.height, z1, x1, -this.height, z1);
                this.indices.push(indices++);
                this.indices.push(indices++);
                this.normals.push(0.0, 0.0, 1.0, 0.0, 0.0, 1.0);
            }
        }
        else {
            let heightOffset = this.height / this.vertical_freq;
            for (let height = -this.height; height < this.height; height += heightOffset){
                for(let theta = 0; theta < 2 * Math.PI; theta += thetaOffset) {
                    let x1  = this.radius * Math.cos(theta);
                    let z1 =  this.radius * Math.sin(theta);
                    //top point
                    this.vertices.push(x1, height, z1);
                    this.indices.push(indices++);
                    this.normals.push(0.0, 0.0, 1.0);

                }
            }
        }
    }
}