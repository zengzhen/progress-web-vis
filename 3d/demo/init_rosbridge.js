
function init_rosbridge() {
	
// rosbridge_websocket connections
ros = new ROSLIB.Ros({
    url: 'ws://fetch18:9092'
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
//     name : '/head_camera/depth_downsample/points',
//     name : '/head_camera/depth_registered/points',
    messageType : 'sensor_msgs/PointCloud2',
    queue_length: 0
});

point_cloud_listener.subscribe(function(message) {	
    
    // copy point cloud
//     console.log("received point cloud msg: %d x %d", message.width, message.height);
    
    var d = new Date();
    var js_time = d.getTime();
//     console.log("callback "+message.header.stamp.secs+":"+message.header.stamp.nsecs+"  "+js_time);
    
//     var num_nesc_digits = message.header.stamp.nsecs.toString().length;
//     var point_cloud_msg_time = message.header.stamp.secs*1e3 + message.header.stamp.nsecs*Math.pow(10, -num_nesc_digits);

    
    pointcloud_msg = JSON.parse(JSON.stringify(message));
    points_update = true;
    received_point_cloud = true;
//     sleep(200);
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