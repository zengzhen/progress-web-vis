function init_websocket(){
	// c++ websocket connections
	vulcan = new WebSocket("ws://localhost:9091/echo_all");
	vulcan.onopen=function(){
		vulcan.send("web_ready");
	};

	vulcan.onmessage=function(event){
	// 	console.log(event.data);
		var message = JSON.parse(event.data);
	// 	console.log("received message from topic: "+message.topic);
	// 	console.log("message content: "+message.msg);
		
		// render the canvas
		switch(message.topic)
		{
			case "lpm":
	// 			console.log("visualizing local metric map");
				OccupancyGrid(message.msg);
				break;
// 			case "vulcan_robot_state":
// 	// 			console.log("robot pose(x,y,theta): "+message.msg.x+","+message.msg.y+","+message.msg.theta);
// 				point_x = lpm_canvas.width/2 + message.msg.x*scale;
// 				point_y = lpm_canvas.height/2 - message.msg.y*scale;
// 				
// 				// draw motion trace			
// 				if(clear_trace_clicked)
// 				{
// 					motion_trace_ctx.closePath();
// 					motion_trace_ctx.clearRect(0, 0, motion_trace_canvas.width, motion_trace_canvas.height);
// 					motion_trace_ctx.beginPath();
// 					clear_trace_clicked = false;
// 				}else{
// 					motion_trace_ctx.strokeStyle = "rgb(100,100,250)";
// 					motion_trace_ctx.lineTo(point_x, point_y);
// 					motion_trace_ctx.stroke();
// 				}
// 				
// 				// draw fetch footprint
// 				footprint_ctx.clearRect(0, 0, motion_trace_canvas.width, motion_trace_canvas.height);
// 				footprint_ctx.fillStyle = "rgb(100,100,255)";
// 				footprint_ctx.beginPath();
// 				footprint_ctx.arc(point_x,point_y,robot_radius*scale,0,2*Math.PI);
// 				footprint_ctx.closePath();
// 				footprint_ctx.stroke();   
// 				footprint_ctx.fill();
// 				
// 				// draw robot orientation
// 				footprint_ctx.strokeStyle = "rgb(250,50,150)";
// 				footprint_ctx.moveTo(point_x,point_y);
// 				footprint_ctx.lineTo(point_x + Math.cos(message.msg.theta)*scale*2*robot_radius, point_y - Math.sin(message.msg.theta)*scale*2*robot_radius);
// 				footprint_ctx.stroke();
// 
// 				robot_pose.position.x = point_x;
// 				robot_pose.position.y = point_y;
// 				robot_pose.orientation = message.msg.theta;
// 				break;
// 				
// 			case "vulcan_obj_traj":
// 	// 			console.log("1st object traj[0]: " +message.msg[0].x[0]+","+message.msg[0].y[0]+","
// 	// 											   +message.msg[0].xVel[0]+","+message.msg[0].yVel[0]+","
// 	// 											   +message.msg[0].xAccel[0]+","+message.msg[0].yAccel[0]);
// 				object_ctx.clearRect(0, 0, object_canvas.width, object_canvas.height);
// 				if(message.msg)
// 				{
// 					for(var i=0; i<message.msg.length; i++)
// 					{
// 						for(var j=0; j<message.msg[i].x.length; j++)
// 						{
// 							object_point_x = lpm_canvas.width/2 + message.msg[i].x[j]*scale;
// 							object_point_y = lpm_canvas.height/2 - message.msg[i].y[j]*scale;
// 							
// 							estimated_object_vel = Math.sqrt(message.msg[i].xVel[j]*message.msg[i].xVel[j]+message.msg[i].yVel[j]*message.msg[i].yVel[j]);
// 									
// 							if(j==0)
// 							{
// 								object_ctx.beginPath();
// 								object_ctx.arc(object_point_x,object_point_y,object_radius*scale,0,2*Math.PI);
// 								object_ctx.closePath();
// 								object_ctx.stroke();   
// 								object_ctx.fill();
// 								
// 								object_ctx.beginPath();
// 								object_ctx.moveTo(object_point_x, object_point_y);
// 							}else{
// 								object_ctx.lineTo(object_point_x, object_point_y);
// 								object_ctx.stroke();
// 							}
// 						}
// 						object_ctx.closePath();
// 					}
// 				}
// 				break;
// 				
// 			case "vulcan_planner_status":
// 	// 			console.log("planner status: "+metric_planner_status_msgs[message.msg.data]);
// 				if(message.msg.data>=5)
// 				{
// 					console.log("planner returned: "+ metric_planner_status_msgs[message.msg.data]);
// 					
// 					// when the goal pose is successfully achieved
// 					if(message.msg.data==5)
// 					{
// 						nav_ready = true;
// 						current_goal_index++;
// 						if(current_goal_type!="nav")
// 							inside_waypoint = true;
// 					}else{
// 						// deal with failure situation
// 					}
// 				}
// 				
// 				vulcan_planner_status = message.msg.data;
// 				break;
		}
	};

}

function wait_torso(){
	if (!torso_ready){
		setTimeout(wait_torso,1000);
	} else {
		// move arm to side
		console.log("torso is up");
		console.log("moving arm to side");
		move_arm_side_ready = false;
		current_move_group = "move_to_side";
		moveArmSide();
		wait_arm_side();
	}
}

function wait_arm_side(){
	if(!move_arm_side_ready)
		setTimeout(wait_arm_side,1000);
	else{
		console.log("arm moved to side");
// 		if(current_goal_type=="grasp")
// 		{
// 			grasploc_ready = true;
// 			wait_grasploc();
// 		}else if(current_goal_type=="sse")
// 		{
// 			sse_ready = true;
// 			wait_sse();
// 		}
		// tuck arm
		console.log("tucking arm with object");
		tuck_arm_ready = false;
		current_move_group = "tuck";
		tuckWObj();
		wait_tuck_arm();
	}
}

function wait_grasploc(){
	if (!grasploc_ready){
		setTimeout(wait_grasploc,1000);
	} else {
		console.log("grasploc is finished");
		// tuck arm
		console.log("tucking arm with object");
		tuck_arm_ready = false;
		current_move_group = "tuck";
		tuckWObj();
		wait_tuck_arm();
	}
}

function wait_sse(){
	if (!sse_ready){
		setTimeout(wait_sse,1000);
	} else {
		console.log("sse is finished");
		// tuck arm
		console.log("tucking arm");
		tuck_arm_ready = false;
		current_move_group = "tuck";
		tuckWObj();
		wait_tuck_arm();
	}
}

function wait_tuck_arm(){
	if (!tuck_arm_ready){
		setTimeout(wait_tuck_arm,1000);
	} else {
		console.log("arm is tucked");
		
		current_goal_index++;
		if(waypoints.length>current_goal_index)
		{
			// move onto the next goal
			nav_ready = false;
			var waypoint = waypoints[current_goal_index];
			current_goal_type = waypoint.goal_type;
			console.log("moving to goal " + current_goal_index + ": " + current_goal_type);
			generate_hssh_goal(waypoint.targetX, waypoint.targetY, waypoint.oriX, waypoint.oriY);
			wait();
		}
	}
}