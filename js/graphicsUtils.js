/**
 * Created by giorgioconte on 26/02/15.
 */
createNormalGeometry = function(hemisphere){
    if(hemisphere == "left"){
        //return new THREE.SphereGeometry(1.0,10,10);
        return new THREE.CircleGeometry( 1.0, 100);
    } else if(hemisphere == "right"){
        //return new THREE.TorusGeometry( 1, 0.3,10,10);
        return new THREE.RingGeometry( 0.4, 1, 100 );
       //return new THREE.BoxGeometry( 2, 2, 0 );
    }

};


createSelectedGeometry = function (hemisphere) {
    if(hemisphere == "left"){
        return new THREE.CircleGeometry( 2.0, 100);
    } else if(hemisphere == "right"){
        return new THREE.RingGeometry( 0.8, 2 ,10);
        //return new THREE.BoxGeometry( 3, 3, 0 );
    }
};




createRootGeometry = function(hemisphere){

    if(hemisphere == "left"){
        return new THREE.CircleGeometry(3.0,10);
    } else if(hemisphere == "right"){
        //return new THREE.BoxGeometry( 4, 4, 0 );
        return new THREE.RingGeometry( 2.5, 3 ,10);
    }
};


createRootGeometryByObject = function (obj) {

    return createRootGeometry(obj.userData.hemisphere);
}


createNormalGeometryByObject = function(obj){
    if(obj)
        return createNormalGeometry(obj.userData.hemisphere);
};


createSelectedGeometryByObject = function (obj) {
    return createSelectedGeometry(obj.userData.hemisphere);
}
