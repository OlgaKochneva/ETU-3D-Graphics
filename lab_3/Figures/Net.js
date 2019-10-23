
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
        let vertices = [];
        for(let i = 0; i < this.freq; i ++) {
            let left_point = [-this.width, this.height - i * this.vertical_offset, 0];
            let right_point = [this.width, this.height - i * this.vertical_offset, 0];
            vertices = vertices.concat(left_point.concat(right_point));
            let top_point = [-this.width + i * this.horizontal_offset, this.height, 0];
            let low_point = [-this.width + i * this.horizontal_offset, -this.height, 0];
            vertices = vertices.concat(top_point.concat(low_point));
        }
        this.vertices = vertices;
    }
}