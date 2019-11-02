
class Net extends Figure {
    constructor(center, angle, scale, freq, color) {
        super(center, angle, scale);
        this.name = "Net";
        this.vertical_offset = 1 / freq;
        this.horizontal_offset = 1 / freq;
        this.height = freq * this.vertical_offset / 2;
        this.width = freq * this.horizontal_offset / 2;
        this.freq = freq + 1;
        this.color = color;
    }

    initBuffers(){
        this.generateVerticesMatrix();
        //this.generateNormales();
        this.generateColorMatrix();
        this.initPositionBuffer();
        this.initNormalesBuffer();
        this.initColorBuffer();
    }

    generateColorMatrix(){
        let colors = [];
        for (let i=0; i < this.vertices.length / 3; i++) {
            colors = colors.concat(this.color);
        }
        this.colors = colors;
    }

    generateNormales(){
        // for(let i = 0; )
        // this.vertexNormals = [
        //     0.0,  0.0,  1.0,
        //     0.0,  0.0,  1.0,
        //     0.0,  0.0,  1.0,
        //     0.0,  0.0,  1.0
        // ];
    }


    generateVerticesMatrix(){
        let vertices = [];
        for(let i = 0; i < this.freq; i ++) {
            let left_point = [-this.width, this.height - i * this.vertical_offset, 0];
            let right_point = [this.width, this.height - i * this.vertical_offset, 0];
            vertices.push(-this.width, this.height - i * this.vertical_offset, 0);
            this.vertexNormals.push(0.0,  0.0,  1.0);
            vertices.push(this.width, this.height - i * this.vertical_offset, 0);
            this.vertexNormals.push(0.0,  0.0,  1.0);
            let top_point = [-this.width + i * this.horizontal_offset, this.height, 0];
            let low_point = [-this.width + i * this.horizontal_offset, -this.height, 0];
            //vertices = vertices.concat(top_point.concat(low_point));
            vertices.push(-this.width + i * this.horizontal_offset, this.height, 0);
            vertices.push(-this.width + i * this.horizontal_offset, -this.height, 0);
            this.vertexNormals.push(0.0,  0.0,  1.0);
            this.vertexNormals.push(0.0,  0.0,  1.0);
        }
        this.vertices = vertices;
    }
}