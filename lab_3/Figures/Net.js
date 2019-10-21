
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
        for (let i=0; i < this.vertices.length / 3; i++) {
            colors = colors.concat(this.color);
        }
        this.colors = colors;
    }

    generateVerticesMatrix(){
        let vertices = [];
        let vertical_offset = this.height / (this.freq - 1);
        let horizontal_offset = this.width / (this.freq - 1);
        for(let i = 0; i < this.freq; i ++) {
            let left_point = [this.center.x - this.width / 2, (this.center.y + this.height / 2) - i * vertical_offset, this.center.z];
            let right_point = [this.center.x + this.width / 2, (this.center.y + this.height / 2) - i * vertical_offset, this.center.z];
            vertices = vertices.concat(left_point.concat(right_point));
            let top_point = [this.center.x - this.width / 2 + i * horizontal_offset, this.center.y + this.height / 2, this.center.z];
            let low_point = [this.center.x - this.width / 2 + i * horizontal_offset, this.center.y- this.height / 2, this.center.z];
            vertices = vertices.concat(top_point.concat(low_point));
        }
        this.vertices = vertices;
    }
}