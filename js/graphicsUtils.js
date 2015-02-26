/**
 * Created by giorgioconte on 26/02/15.
 */
createNormalGeometry = function(hemisphere){
    if(hemisphere == "left"){
        //return new THREE.SphereGeometry(1.0,10,10);
        return new THREE.CircleGeometry( 1.0, 10);
    } else if(hemisphere == "right"){
        //return new THREE.TorusGeometry( 1, 0.3,10,10);
        return new THREE.RingGeometry( 0.5, 1, 10 );
    }

};


createSelectedGeometry = function (hemisphere) {
    if(hemisphere == "left"){
        return new THREE.CircleGeometry( 2.0, 10);
    } else if(hemisphere == "right"){
        return new THREE.RingGeometry( 1, 2 ,10);
    }
};




createRootGeometry = function(hemisphere){

    if(hemisphere == "left"){
        return new THREE.SphereGeometry(3.0,10,10);
    } else if(hemisphere == "right"){
        return new THREE.TorusGeometry( 3, 0.9 ,10,10);
    }
};


createNormalGeometryByObject = function(obj){
};