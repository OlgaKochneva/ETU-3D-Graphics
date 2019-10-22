class Cylinder extends Figure {
    constructor(center, angle, scale, color) {
        super(center, angle, scale);
        this.name = "Rectangle";
        this.radius = 1;
        this.height = 1;
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
        // generate vertices, normals and uvs
        for ( let y = 0; y <= 30; y ++ ) {
            var v = y / 30;

            // calculate the radius of the current row
            var radius = this.radius;

            for (let x = 0; x <= 30; x ++ ) {
                var u = x / 30;
                var theta = u * Math.PI * 2;
                var sinTheta = Math.sin( theta );
                var cosTheta = Math.cos( theta );

                // vertex
                let vertex_x = radius * sinTheta;
                let vertex_y = - v * this.height + this.height/2;
                let vertex_z = radius * cosTheta;
                this.vertices = this.vertices.concat(vertex_x, vertex_y, vertex_z );
            }

        }
    }
}
