function init_canvas(){
    'use strict';
    
    var container, mouseX = 0, mouseY = 0, controls;

    init();
    animate();

    function init() {
        controls = new THREE.OrbitControls( camera );
        controls.addEventListener( 'change', render );  

        container = document.createElement('div');
        document.body.appendChild(container);
        document.body.style.margin = 0;
        document.body.style.overflow = 'hidden';
        container.appendChild(renderer.domElement); /* Let's add all this crazy junk to the page.   */

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.right = '0px';
        container.appendChild(stats.domElement);

        window.addEventListener('resize', onWindowResize, false);

    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        
        if(points_update)
        {
            parsePointCloud();
            currentPointCloud.geometry.setDrawRange(0, points_size);
            currentPointCloud.geometry.attributes.position.needsUpdate = true;
            currentPointCloud.geometry.attributes.color.needsUpdate = true;
            
            points_update = false;
        }
        
        var robot_model = scene.getObjectByName( "robot_model" );
        if(robot_model!=undefined)
        {            
            var temp_robot_pose = new ROSLIB.Pose(robot_pose);
            temp_robot_pose.applyTransform(orbit_tf);
            
            robot_model.position.x = temp_robot_pose.position.x;
            robot_model.position.y = temp_robot_pose.position.y;            
            robot_model.position.z = temp_robot_pose.position.z;        
            
            var quaternion = new THREE.Quaternion(temp_robot_pose.orientation.x, temp_robot_pose.orientation.y, temp_robot_pose.orientation.z, temp_robot_pose.orientation.w);
            robot_model.rotation.setFromQuaternion(quaternion, 'XYZ');
        }
        
        var robot_tf = new ROSLIB.Transform();
        robot_tf.translation = robot_pose.position;
        robot_tf.rotation = robot_pose.orientation;
        
        var pointcloud_pose = new ROSLIB.Pose();
        pointcloud_pose.applyTransform(tf_point_cloud);
        pointcloud_pose.applyTransform(robot_tf);
        pointcloud_pose.applyTransform(orbit_tf);
        
        var rgbd_stream = scene.getObjectByName( "rgbd_stream" );
        if(rgbd_stream!=undefined)
        {
            rgbd_stream.position.x = pointcloud_pose.position.x;
            rgbd_stream.position.y = pointcloud_pose.position.y;
            rgbd_stream.position.z = pointcloud_pose.position.z;
            
            var quaternion = new THREE.Quaternion(pointcloud_pose.orientation.x, pointcloud_pose.orientation.y, pointcloud_pose.orientation.z, pointcloud_pose.orientation.w);
            rgbd_stream.rotation.setFromQuaternion(quaternion);
        }
        
        render();
        
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        render();
    }

}

function render() {
    renderer.render(scene, camera);
}

function parsePointCloud(){
    var skip = 1;

    var positions = currentPointCloud.geometry.attributes.position.array;
    var colors = currentPointCloud.geometry.attributes.color.array;

    var buffer;
    if(pointcloud_msg.data.buffer){
        buffer = JSON.parse(JSON.stringify(pointcloud_msg.data.buffer.buffer));
    }else{
        buffer = Uint8Array.from(decode64(pointcloud_msg.data)).buffer;
    }
    var dv = new DataView(buffer);

    points_size = 0;
    for(var i=0;i<pointcloud_msg.width*pointcloud_msg.height;i=i+skip)
    {
        var pt = read_point(pointcloud_msg, i, dv);
        
        var rgb = pt['rgb'];
        var r = (rgb >> 16) & 0x0000ff;
        var g = (rgb >> 8) & 0x0000ff;
        var b = (rgb) & 0x0000ff;
        
        positions[i*3] = pt['x'];
        positions[i*3+1] = pt['y'];
        positions[i*3+2] = pt['z'];
        
        colors[i*3] = r/255;
        colors[i*3+1] = g/255;
        colors[i*3+2] = b/255;
        
        points_size = points_size+1;
    }
}

