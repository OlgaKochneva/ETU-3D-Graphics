
class Net extends Figure {
    constructor(center, height, width, freq, color) {
        super(center);
        this.name = "Net";
        this.height = height;
        this.width = width;
        this.freq = freq+1;
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
        for (let i=0; i < this.freq * 4; i++) {
            colors = colors.concat(this.color);
        }
        this.colors = colors;
    }

    generateVerticesMatrix(){
        let vertices = [];
        let vertical_offset = this.height / (this.freq - 1);
        let horizontal_offset = this.width / (this.freq - 1);
        for(let i = 0; i < this.freq; i ++) {
            let left_point = [this.center[0] - this.width / 2, (this.center[1] + this.height / 2) - i * vertical_offset, 0.0];
            let right_point = [this.center[0] + this.width / 2, (this.center[1] + this.height / 2) - i * vertical_offset, 0.0];
            vertices = vertices.concat(left_point.concat(right_point));
            let top_point = [this.center[0] - this.width / 2 + i * horizontal_offset, this.center[1] + this.height / 2, 0.0];
            let low_point = [this.center[0] - this.width / 2 + i * horizontal_offset, this.center[1] - this.height / 2, 0.0];
            vertices = vertices.concat(top_point.concat(low_point));
        }
        this.vertices = vertices;
    }
}