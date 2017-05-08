function init_params(){
	// config params
    stats = new Stats();
    
    // time offset: point cloud msg time v.s. js time
    time_offset = -1; // in ms
    time_render_finished = -1;
    laser_offset = 0.0235;
    
    robot_pose = new ROSLIB.Pose();
    
    /*****************************************************
     * point cloud
     * **************************************************/
    tf_point_cloud = new ROSLIB.Transform();
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
    
    // point cloud setup
    currentPointCloud = new THREE.PointCloud(geometry, material);
    currentPointCloud.name = "rgbd_stream";
    
    /*****************************************************
    * occupancy grid
    * **************************************************/    
    var lpm_grid_width = 1500;
    var lpm_resolution = 0.05;
    var lpm_real_size = lpm_grid_width*lpm_resolution;
    plane_geometry=new THREE.PlaneGeometry(lpm_real_size,lpm_real_size);
    
    lpm_canvas = document.createElement('canvas');
    lpm_canvas.width = 1500;
    lpm_canvas.height = 1500;
    lpm_ctx = lpm_canvas.getContext('2d');
    lpm_ctx.fillStyle="gray";
    lpm_ctx.fillRect(0,0,lpm_canvas.width,lpm_canvas.height);
    
    occupancy_grid_texture = new THREE.Texture(lpm_canvas);
    occupancy_grid_texture.needsUpdate = true;
    
    var occupancy_grid_material = new THREE.MeshBasicMaterial({
        map : occupancy_grid_texture,
        side: THREE.DoubleSide,
        blending: THREE.NoBlending,
        vertexColors: THREE.FaceColors,
        shading: THREE.FlatShading
    });
    
    occupancy_grid = new THREE.Mesh( plane_geometry, occupancy_grid_material );
    
    occupancy_grid.position.z = 0;
    // TODO set plane normal based on the tf (maybe not necessary if we use base_link as the global coordinate)
    occupancy_grid.lookAt(new THREE.Vector3(0, 1, 0));
    
    /*****************************************************
    * scene setup
    * **************************************************/
    fogHex = 0x000000; /* As black as your heart.   */
    fogDensity = 0.0007; /* So not terribly dense?  */
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(fogHex, fogDensity);

    scene.add(currentPointCloud);
    scene.add(occupancy_grid);
    
    axes = new THREE.AxisHelper( 10 );
    scene.add( axes );
    
    // camera setup
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    fieldOfView = 75;
    aspectRatio = WIDTH / HEIGHT;
    nearPlane = 0.4;
    farPlane = 1000;
    
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    camera.position.y = 15;
    camera.up.set(0,1,0);
    
    // renderer setup
    renderer = new THREE.WebGLRenderer(); 
//         renderer.setPixelRatio(window.devicePixelRatio); /* Probably 1; unless you're fancy.    */
    renderer.setSize(WIDTH, HEIGHT);

    orbit_tf = new ROSLIB.Transform();
    var quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler(-Math.PI/2, Math.PI/2, 0, 'ZYX'));
    orbit_tf.rotation.x = quaternion.x;
    orbit_tf.rotation.y = quaternion.y;
    orbit_tf.rotation.z = quaternion.z;
    orbit_tf.rotation.w = quaternion.w;

}