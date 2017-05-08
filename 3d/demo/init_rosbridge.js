
function init_rosbridge() {
	
// rosbridge_websocket connections
ros = new ROSLIB.Ros({
    url: 'ws://localhost:9092'
//     url : 'ws://demo.robotwebtools.org:9090'
}); 

ros.on('connection', function() {
    console.log('roslib: connect to websocket server.');
});

ros.on('error', function(error) {
    console.log('roslib: error connecting to websocket server', error);
});

ros.on('close', function() {
    console.log('roslib: connection to websocket server closed.');
});

point_cloud_listener = new ROSLIB.Topic({
    ros : ros,
    name : '/downsampled_points_throttle',
    messageType : 'sensor_msgs/PointCloud2',
    queue_length: 0
});

point_cloud_listener.subscribe(function(message) {	
    
    // copy point cloud    
    pointcloud_msg = JSON.parse(JSON.stringify(message));
    points_update = true;
    received_point_cloud = true;
});

tfClient = new ROSLIB.TFClient({
    ros : ros,
    angularThres : 0.01,
    transThres : 0.01,
    rate : 10.0,
    fixedFrame: '/base_link'
});

//head_camera_rgb_optical_frame
tfClient.subscribe("/head_camera_rgb_optical_frame", function(msg) {
    tf_point_cloud = new ROSLIB.Transform(msg);
  });

}

function read_point(msg, index, data_view){
    var pt = [];
    var base = msg.point_step * index;
    var n = 4;
    for(var fi=0; fi<msg.fields.length; fi++){
        var si = base + msg.fields[fi].offset;

        if( msg.fields[fi].name === 'rgb' ){
            pt[ 'rgb' ] = data_view.getUint32(si, 1);
        }else{
            pt[ msg.fields[fi].name ] = data_view.getFloat32(si, 1);
        }
    }
    return pt;
}

var BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
function decode64(x) {
    var a = [], z = 0, bits = 0;

    for (var i = 0, len = x.length; i < len; i++) {
        z += BASE64.indexOf( x[i] );
        bits += 6;
        if(bits>=8){
            bits -= 8;
            a.push(z >> bits);
            z = z & (Math.pow(2, bits)-1);
        }
        z = z << 6;
    }
    return a;
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}