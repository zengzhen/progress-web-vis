function init_canvas_occupancy_grid(){
    
    
//     motion_trace_canvas = document.getElementById("motion_trace_layer");
//     motion_trace_ctx = motion_trace_canvas.getContext("2d");
//     motion_trace_ctx.beginPath();
//     
//     footprint_canvas = document.getElementById("footprint_layer");
//     footprint_ctx = footprint_canvas.getContext("2d");
/*    
    laser_canvas = document.getElementById("laser_layer");
    laser_ctx = laser_canvas.getContext("2d");
    laser_ctx.strokeStyle="rgb(50,150,255)";*/
    
    // layer for interactively set goal poses
//     goal_pose_canvas = document.getElementById("goal_pose_layer");
//     goal_pose_ctx = goal_pose_canvas.getContext("2d");
    
    // layer for visualizing all poses that were set
//  final_pose_canvas = document.getElementById("final_pose_layer");
//  final_pose_ctx = final_pose_canvas.getContext("2d");
//  final_pose_ctx.clearRect(0,0,final_pose_ctx.width,final_pose_ctx.height);
    
//     lpm_canvas = document.getElementById("lpm_layer");
//     lpm_ctx = lpm_canvas.getContext("2d");
//     lpm_ctx_initial = true;
    
//     object_canvas = document.getElementById("object_layer");
//     object_ctx = object_canvas.getContext("2d");
//     object_ctx.fillStyle = "rgb(250,173,30)";
//     object_ctx.clearRect(0,0,object_ctx.width,object_ctx.height);
//     object_ctx.strokeStyle = "rgb(250,173,30)";           
// 
//     nav_goal_color = "rgb(94,158,219)";
//     grasp_goal_color = "rgb(53,219,117)";   
//     home_goal_color = "rgb(240,189,226)";
//     
//     goal_pose_canvas.addEventListener("mousemove", function(e){
//         if(select_goal_clicked)
//         {
//             if(e.which!==1 & !goal_canvas_clicked)
//             {
//                 // if mouse over but not clicked yet
//                 targetX = e.pageX;
//                 targetY = e.pageY;
//                 
//                 // target circle follows cursor until the mouse is clicked
//                 draw_goal_position(targetX, targetY, goal_type, true);
//             }else if(e.which==1){
//                 // if mouse over and clicked
//                 oriX = e.pageX;
//                 oriY = e.pageY;
//                 
//                 // orient the goal orientation when mouse is down and moves around
//                 draw_goal_orientation(targetX, targetY, oriX, oriY, goal_type, true);
//             }
//             draw_waypoints();   
//         }
//     });
//     
//     goal_pose_canvas.addEventListener("click", function(e){
//         if(select_goal_clicked)
//         {
//             goal_canvas_clicked = true;
//         }
//     });
//     
//     goal_pose_canvas.addEventListener("mouseup", function(e){
//         if(select_goal_clicked)
//         {
//             var waypoint = {targetX: targetX, targetY: targetY, oriX: oriX, oriY: oriY, goal_type: goal_type};
//             waypoints.push(waypoint);
//             console.log("add one waypoint: " + goal_type);
//             goal_set = false;
//             select_goal_clicked = false;
//         }
//     });
//     
//     allCanvas = [
//         motion_trace_canvas,
//         footprint_canvas,
//         laser_canvas,
//         goal_pose_canvas,
//         lpm_canvas,
//         object_canvas,
//         goal_pose_canvas
//     ];
}

// function zoom_canvas(zoom_canvas, zoom_scale){
//     zoom_ctx = zoom_canvas.getContext("2d");
//     var imageData = zoom_ctx.getImageData(0, 0, zoom_canvas.width, zoom_canvas.height);
//     var copiedCanvas = document.createElement('canvas');
//     copiedCanvas.width = zoom_canvas.width;
//     copiedCanvas.height = zoom_canvas.height;
//     copiedCanvas.getContext("2d").putImageData(imageData, 0, 0);
// 
//     var newWidth = zoom_canvas.width * zoom_scale;
//     var newHeight = zoom_canvas.height * zoom_scale;
//     
//     zoom_ctx.save();
//     zoom_ctx.clearRect(0, 0, zoom_canvas.width, zoom_canvas.height);
//     zoom_ctx.translate(-((newWidth-zoom_canvas.width)/2), -((newHeight-zoom_canvas.height)/2));
//     zoom_ctx.scale(zoom_scale, zoom_scale);
//     zoom_ctx.drawImage(copiedCanvas, 0, 0);
//     zoom_ctx.restore();
// }
// 
// function zoom_all_canvas(zoom_scale){
//     for(var i = 0, canvas; canvas = allCanvas[i++];)
//         zoom_canvas(canvas, zoom_scale);
// }
/*


function draw_waypoints(){
    // draw all waypoints
    if(waypoints.length!=0)
    {
        for(var i=0; i<waypoints.length; i++)
        {
            var waypoint = waypoints[i];
            draw_goal_orientation(waypoint.targetX, waypoint.targetY, waypoint.oriX, waypoint.oriY, waypoint.goal_type, false);
        }
    }
}

function draw_goal_position(targetX, targetY, goal_type, clear){
    if(clear)
        goal_pose_ctx.clearRect(0,0,goal_pose_canvas.width,goal_pose_canvas.height);
    if(goal_type=="nav")
        goal_pose_ctx.fillStyle = nav_goal_color;
    else if(goal_type=="grasp" | goal_type=="mgrasp")
        goal_pose_ctx.fillStyle = grasp_goal_color;
    else if(goal_type=="sse" | goal_type=="msse")
        goal_pose_ctx.fillStyle = home_goal_color;
    goal_pose_ctx.beginPath();
    goal_pose_ctx.arc(targetX,targetY,robot_radius*scale,0,Math.PI*2);
    goal_pose_ctx.fill();
}

function draw_goal_orientation(targetX, targetY, oriX, oriY, goal_type, clear){
    if(clear)
        goal_pose_ctx.clearRect(0,0,goal_pose_canvas.width,goal_pose_canvas.height);
    
    draw_goal_position(targetX, targetY, goal_type, clear);
    
    // target orientation follows cursor
    goal_pose_ctx.strokeStyle = "rgb(100,100,250)";
    tempVector = new THREE.Vector3(oriX-targetX, oriY-targetY, 0);
    tempVector.normalize();
    goal_pose_ctx.moveTo(targetX, targetY);
    goal_pose_ctx.lineTo(targetX+tempVector.x*scale*2*robot_radius, targetY+tempVector.y*scale*2*robot_radius);
    goal_pose_ctx.stroke();
}

function generate_hssh_goal(targetX, targetY, oriX, oriY){
    robotVectorX = 1;
    robotVectorY = 0;
    robotVectorXPrime = -robotVectorY;
    robotVectorYPrime = robotVectorX;
    
    targetVectorX = oriX - targetX;
    targetVectorY = targetY - oriY;
    
    dot1 = robotVectorX*targetVectorX + robotVectorY*targetVectorY;
    dot2 = robotVectorXPrime*targetVectorX + robotVectorYPrime*targetVectorY;
    robotVectorNorm = Math.sqrt(robotVectorX*robotVectorX + robotVectorY*robotVectorY);
    targetVectorNorm = Math.sqrt(targetVectorX*targetVectorX + targetVectorY*targetVectorY);
    targetOriInRobotFrame = Math.acos(dot1/(robotVectorNorm*targetVectorNorm));
    
    if(dot2<0)
        targetOriInRobotFrame = -targetOriInRobotFrame;
    
    // in starting frame: left x, down y
    targetTransXInStartFrame = (-(targetX - robot_pose.position.x))/scale;
    targetTransYInStartFrame = (targetY - robot_pose.position.y)/scale;
    targetTransXInRobotFrame = targetTransXInStartFrame*Math.cos(robot_pose.orientation) + targetTransYInStartFrame*Math.sin(robot_pose.orientation);
    targetTransYInRobotFrame = -targetTransXInStartFrame*Math.sin(robot_pose.orientation) + targetTransYInStartFrame*Math.cos(robot_pose.orientation);
    
    // send the goal pose
    var goal_message = new ROSLIB.Message({
        x: (targetX-goal_pose_canvas.width/2)/scale,
        y: (goal_pose_canvas.height/2-targetY)/scale,
        theta: targetOriInRobotFrame,
    });
    
    goal_publisher.publish(goal_message);
    console.log('targetX, targetY: ' + targetX + ', ' + targetY);
    console.log('/hssh_goal_pose: ' + goal_message.x + ', ' + goal_message.y, ', ' + goal_message.theta);
}

function wait(){
    if (!nav_ready){
        setTimeout(wait,1000);
    } else {
        nav_ready = false;
        if(current_goal_type=="grasp")
        {
            console.log("preparing for grasploc");
            // lift torso up
            console.log("lifting torso up");
            toros_ready = false;
            torsoUp();
            wait_torso();                           
        }else if(current_goal_type=="sse")
        {
            console.log("preparing for sse");
            // lift torso up
            console.log("lifting torso up");
            toros_ready = false;
            torsoUp();
            wait_torso();
        }
    }
}*/


