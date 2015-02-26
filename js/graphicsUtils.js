/**
 * Created by giorgioconte on 26/02/15.
 */
createNormalGeometry = function(hemisphere){
    if(hemisphere == "left"){
        //return new THREE.SphereGeometry(1.0,10,10);
        return new THREE.CircleGeometry( 1.0, 10);
    } else if(hemisphere == "right"){
        //return new THREE.TorusGeometry( 1, 0.3,10,10);
        //return new THREE.RingGeometry( 0.3, 1, 10 );
       return new THREE.BoxGeometry( 2, 2, 0 );
    }

};


createSelectedGeometry = function (hemisphere) {
    if(hemisphere == "left"){
        return new THREE.CircleGeometry( 2.0, 10);
    } else if(hemisphere == "right"){
        //return new THREE.RingGeometry( 0.6, 2 ,10);
        return new THREE.BoxGeometry( 3, 3, 0 );
    }
};




createRootGeometry = function(hemisphere){

    if(hemisphere == "left"){
        return new THREE.SphereGeometry(3.0,10,10);
    } else if(hemisphere == "right"){
        return new THREE.TorusGeometry( 3, 0.9 ,10,10);
    }
};


createRootGeometryByObject = function (obj) {
    //console.log(obj);
    debug1 = obj;
    console.log(obj.userData.hemisphere);
    createRootGeometry(obj.userData.hemisphere);
}


createNormalGeometryByObject = function(obj){
    //console.log("normal" + obj);
    debug2 = obj;
    if(obj)
        return createNormalGeometry(obj.userData.hemisphere);
};


createSelectedGeometryByObject = function (obj) {
    //console.log(obj);
    debug3 = obj;
    return createSelectedGeometry(obj.userData.hemisphere);
}
