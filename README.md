# demo_web
web front-end for robot demos: [Youtube Video](https://www.youtube.com/watch?v=ltS5nVfyOWA)

## Run
### on local workstation
``rosrun rosbridge_server rosbridge_websocket _port:=9092``

``rosrun tf2_web_republisher tf2_web_republisher``

``rosrun rosapi rosapi_node``

``cd /opt/ros/indigo/share`` (first copy demo_web/3d/cors_server.py here)

``python cors_server.py``
### ssh on robot
``rosrun cloud_server pointcloud_downsample``

``rosrun topic_tools throttle messages /downsampled_points 1``
### 2D mapping
we have a private 2D mapping module running on the robot, but you can choose to use any public ros package for 2D occupancy mapping and modify the web visualization interface accordingly 
### browser
open demo_web/3d/progress_demos.html
