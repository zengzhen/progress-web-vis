function init_robot(){
    
//     var viewer = new ROS3D.Viewer({
//         divID : 'urdf',
//         width : window.innerWidth,
//         height : window.innerHeight,
//         antialias : true,
//         background: '#002233'
//     });
//     viewer.addObject(new ROS3D.Grid({
//         color:'#0181c4',
//         cellSize: 0.5,
//         num_cells: 20
//     }));

    new ROS3D.UrdfClient({
        ros : ros,
        tfClient : tfClient,
//         path : 'http://resources.robotwebtools.org/',
        path : 'http://localhost:8000/',
        rootObject : scene,
        loader :  ROS3D.COLLADA_LOADER_2
    });
}