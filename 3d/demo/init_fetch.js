function init_fetch(){
    // get robot description
    var getParam = new ROSLIB.Param({
        ros : ros,
        name : 'robot_description'
    });
    
    // set up tf tfClient
    var tfClient = new ROSLIB.TFClient({
        ros : ros,
        angularThres : 0.01,
        transThres : 0.01,
        rate : 10.0,
        fixedFrame: '/base_link'
    });
    
    getParam.get(function(string) {
        // hand off the XML string to the URDF model
        var urdfModel = new ROSLIB.UrdfModel({
            string : string
        });

        // load all models
        urdf = new ROS3D.Urdf({
            urdfModel : urdfModel,
            path : 'http://localhost:8000/',
            tfClient : tfClient,
            tfPrefix : '',
            loader : THREE.ColladaLoader
        });
    });

    
}