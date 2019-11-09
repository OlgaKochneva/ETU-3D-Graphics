class Cylinder extends Figure {
    constructor(center, angle, scale, color) {
        super(center, angle, scale, color);
        this.radius = 1;
        this.height = 1;
        this.heightSegments = 1;
        this.radialSegments = 20;
        this.index = 0;
    }

    initBuffers() {
        this.generateCap(true);// крышка цилиндра верх
        this.generateCap(false); // крышка цилинда низ
        this.generateTorso(); // цилиндр

        this.initPositionBuffer();
        this.initIndexBuffer();
        this.initTextureCoordsBuffer();
        this.initNormalesBuffer();
    }
    

    generateTorso() {
        let x, y;
        let indexArray = [];
        let halfHeight = this.height / 2;
        // this will be used to calculate the normal
        // generate vertices, normals and uvs
        for (y = 0; y <= this.heightSegments; y++) {
            let indexRow = [];
            let v = y / this.heightSegments;
            // calculate the radius of the current row
            //let radius = v * (radiusBottom - radiusTop) + radiusTop;
            for (x = 0; x <= this.radialSegments; x++) {
                let u = x / this.radialSegments;
                let theta = u * 2 * Math.PI;
                let sinTheta = Math.sin(theta);
                let cosTheta = Math.cos(theta);

                // vertex
                this.vertices.push(this.radius * sinTheta, -v * this.height + halfHeight, this.radius * cosTheta);

                // normal
                let length = Math.pow(Math.pow(Math.sqrt(sinTheta), 2) + Math.pow(Math.sqrt(cosTheta), 2), 1/2)
                this.vertexNormales.push(sinTheta/length, 0, cosTheta/length);
                this.textureCoords.push( u, 1 - v );
                // save index of vertex in respective row
                indexRow.push(this.index++);
            }
            // now save vertices of the row in our index array
            indexArray.push(indexRow);
        }

        // generate indices
        for (x = 0; x < this.radialSegments; x++) {
            for (y = 0; y < this.heightSegments; y++) {
                // we use the index array to access the correct indices
                let a = indexArray[y][x];
                let b = indexArray[y + 1][x];
                let c = indexArray[y + 1][x + 1];
                let d = indexArray[y][x + 1];
                // faces
                this.indices.push(a, b, d);
                this.indices.push(b, c, d);
            }
        }
    }

    generateCap(top) {
        let x, centerIndexStart, centerIndexEnd;
        let halfHeight = this.height / 2;
        let sign = (top === true) ? 1 : -1;
        let thetaStart = 0.0;
        let thetaLength = 2 * Math.PI;

        // save the index of the first center vertex
        centerIndexStart = this.index;

        // first we generate the center vertex data of the cap.
        // because the geometry needs one set of uvs per face,
        // we must generate a center vertex per face/segment
        for (x = 1; x <= this.radialSegments; x++) {
            // vertex
            this.vertices.push(0, halfHeight * sign, 0);

            // normal
            this.vertexNormales.push(0, sign, 0);
            this.textureCoords.push( 0.5, 0.5);
            // increase index
            this.index++;
        }

        // save the index of the last center vertex
        centerIndexEnd = this.index;
        // now we generate the surrounding vertices, normals and uvs
        for (x = 0; x <= this.radialSegments; x++) {
            let u = x / this.radialSegments;
            let theta = u * thetaLength + thetaStart;
            let cosTheta = Math.cos(theta);
            let sinTheta = Math.sin(theta);
            // vertex
            this.vertices.push(this.radius * sinTheta, halfHeight * sign, this.radius * cosTheta);

            // normal
            this.textureCoords.push( cosTheta * 0.5  + 0.5, sinTheta * 0.5 * sign  + 0.5 );
            this.vertexNormales.push(0, sign, 0);

            // increase index
            this.index++;
        }

        // generate indices
        for (x = 0; x < this.radialSegments; x++) {

            let c = centerIndexStart + x;
            let i = centerIndexEnd + x;
            if (top === true) {
                // face top
                this.indices.push(i, i + 1, c);
            }
            else {
                // face bottom
                this.indices.push(i + 1, i, c);
            }
        }
    }
}
