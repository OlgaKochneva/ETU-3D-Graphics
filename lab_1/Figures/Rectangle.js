class Rectangle extends Figure {
    constructor(center, a, b, color) {
        super(center);
        this.name = "Rectangle";
        this.aSide = a;
        this.bSide = b;
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
        for (let i=0; i < 4; i++) {
            colors = colors.concat(this.color);
        }
        this.colors = colors;
    }

    generateVerticesMatrix(){
        this.vertices = [
            this.aSide / 2, this.bSide / 2, 0.0,
            -this.aSide / 2, this.bSide / 2, 0.0,
            this.aSide / 2, -this.bSide / 2, 0.0,
            -this.aSide / 2, -this.bSide / 2, 0.0
        ];
    }
}