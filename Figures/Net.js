class Net extends Figure {
    constructor(center, angle, scale, freq, color) {
        super(center, angle, scale, color);
        this.vertical_offset = 1 / freq;
        this.horizontal_offset = 1 / freq;
        this.height = 1/2;
        this.width = 1/2;
        this.freq = freq + 1;
    }

    initBuffers(){
        this.generateVerticesMatrix();
        this.generateNormalesMatrix();
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

    generateNormalesMatrix(){
        for(let i = 0; i < this.freq * 4; i++) {
            this.vertexNormales.push(0.0,  0.0,  1.0);
        }
    }

    generateVerticesMatrix(){
        for(let i = 0; i < this.freq; i++) {
            //left_point
            this.vertices.push(-this.width, this.height - i * this.vertical_offset, 0);
            //right_point
            this.vertices.push(this.width, this.height - i * this.vertical_offset, 0);
            //top_point
            this.vertices.push(-this.width + i * this.horizontal_offset, this.height, 0);
            //low_point
            this.vertices.push(-this.width + i * this.horizontal_offset, -this.height, 0);
        }
    }
}