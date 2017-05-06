function init_canvas_point_cloud(){
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
            
            var d = new Date();
//             console.log("before render "+pointcloud_msg.header.stamp.secs+":"+pointcloud_msg.header.stamp.nsecs+"  "+d.getTime())
            
            render();
        
            d = new Date();
            time_render_finished = d.getTime();
//             console.log("after render " + time_render_finished)
        }
        
    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

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
//         console.log("getting object buffer");
//             buffer = pointcloud_msg.data.buffer.buffer;
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
        
        positions[i*3] = -pt['x'];
        positions[i*3+1] = -pt['y'];
        positions[i*3+2] = -pt['z'];
        
        colors[i*3] = r/255;
        colors[i*3+1] = g/255;
        colors[i*3+2] = b/255;
        
        points_size = points_size+1;
    }
}

