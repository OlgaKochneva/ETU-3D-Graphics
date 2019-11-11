class Point3 {
    constructor(x=0, y=0, z=0){
        this.x = x;
        this.y = y;
        this.z = z
    }

    toArray(){
        return [this.x, this.y, this.z];
    }
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}