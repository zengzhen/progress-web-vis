function init_params(){
	// config params
    stats = new Stats();
    
    // time offset: point cloud msg time v.s. js time
    time_offset = -1; // in ms
    time_render_finished = -1;
    
    // point cloud size & flag
    points_size = 0;
    points_update = false;
    pointcloud_msg = 0;
    
    // point cloud geometry
    var positions = new Float32Array( 640*480*3 );
    var colors = new Float32Array( 640*480*3 );
    geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    geometry.setDrawRange( 0, points_size );
    
    // point cloud material
    material = new THREE.PointCloudMaterial({
        size: 0.02,
        vertexColors: THREE.VertexColors
    });
//      material = new THREE.PointCloudMaterial({
//         size: 0.01
//     });
//      material.color = new THREE.Color(Math.random(), Math.random(), Math.random());
    
    // occupancy grid geometry
    var geometry = new THREE.PlaneBufferGeometry( 5, 20, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometry, material );
    scene.add( plane );
    
    // occupancy grid material
    
    // scene setup
    fogHex = 0x000000; /* As black as your heart.   */
    fogDensity = 0.0007; /* So not terribly dense?  */
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(fogHex, fogDensity);
    
    currentPointCloud = new THREE.PointCloud(geometry, material);
    scene.add(currentPointCloud);
    
    // camera setup
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    fieldOfView = 75;
    aspectRatio = WIDTH / HEIGHT;
    nearPlane = 0.4;
    farPlane = 20;
    
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    camera.position.z = 15;
    
    // renderer setup
    renderer = new THREE.WebGLRenderer(); 
//         renderer.setPixelRatio(window.devicePixelRatio); /* Probably 1; unless you're fancy.    */
    renderer.setSize(WIDTH, HEIGHT);
    
    debugger_count = 0;
    
}