function init_websocket(){
	// c++ websocket connections
	vulcan = new WebSocket("ws://localhost:9091/echo_all");
	vulcan.onopen=function(){
		vulcan.send("web_ready");
	};

	vulcan.onmessage=function(event){
		var message = JSON.parse(event.data);
		
		// render the canvas
		switch(message.topic)
		{
			case "lpm":
				OccupancyGrid(message.msg);
				break;
			case "vulcan_robot_state":                
                var point_x = message.msg.x;
                var point_y = message.msg.y;
				
				robot_pose.position.x = point_x;
				robot_pose.position.y = point_y;
                
                var quaternion = new THREE.Quaternion();
                quaternion.setFromEuler(new THREE.Euler(0, 0, message.msg.theta));
				robot_pose.orientation.x = quaternion.x;
                robot_pose.orientation.y = quaternion.y;
                robot_pose.orientation.z = quaternion.z;
                robot_pose.orientation.w = quaternion.w;
				break;
		}
	};

}
