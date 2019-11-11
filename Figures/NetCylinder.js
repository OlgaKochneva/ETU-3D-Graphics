class NetCylinder extends Figure {
    constructor(center, angle, scale, vertical_freq, horizontal_freq, color) {
        super(center, angle, scale);
        this.name = "Net";
        this.radius = 1;
        this.height = 1 / 2;
        this.vertical_freq = vertical_freq;
        this.horizontal_freq = horizontal_freq;
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
        let vertices = [];
        if (this.vertical_freq === 0){
            thetaOffset = 2 * Math.PI / this.horizontal_freq;
            for(let theta = 0; theta < 2 * Math.PI; theta += thetaOffset) {
                let x1  = this.radius * Math.cos(theta);
                let z1 =  this.radius * Math.sin(theta);
                //let x2  =  this.radius * Math.cos(theta + thetaOffset);
                //let z2 = this.radius * Math.sin(theta + thetaOffset);
                //top point
                vertices.push(x1, this.height, z1, x1, -this.height, z1);
                //low point
                //vertices.push(x2, this.height, z2, x2, -this.height, z2);
            }
        }
        else {
            let heightOffset = this.height / this.vertical_freq;
            for (let height = -this.height; height < this.height; height += heightOffset){
                for(let theta = 0; theta < 2 * Math.PI; theta += thetaOffset) {
                    let x1  = this.radius * Math.cos(theta);
                    let z1 =  this.radius * Math.sin(theta);
                    //let x2  =  this.radius * Math.cos(theta + thetaOffset);
                    //let z2 = this.radius * Math.sin(theta + thetaOffset);
                    //top point
                    vertices.push(x1, height, z1);
                    //low point
                    //vertices.push(x1, -height, z1, x2, -height, z2);
                }
            }
        }

        this.vertices = vertices;



        // let vertices = [];
        // for(let i = 0; i < this.freq; i ++) {
        //     let left_point = [-this.width, this.height - i * this.vertical_offset, 0];
        //     let right_point = [this.width, this.height - i * this.vertical_offset, 0];
        //     vertices = vertices.concat(left_point.concat(right_point));
        //
        //     let top_point = [-this.width + i * this.horizontal_offset, this.height, 0];
        //     let low_point = [-this.width + i * this.horizontal_offset, -this.height, 0];
        //     vertices = vertices.concat(top_point.concat(low_point));
        // }
        // this.vertices = vertices;
    }
}
