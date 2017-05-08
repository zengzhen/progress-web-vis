# demo_web
web front-end for progress demons

## Run
### on local workstation
``rosrun rosbridge_server rosbridge_websocket _port:=9092``

``rosrun tf2_web_republisher tf2_web_republisher``

``rosrun rosapi rosapi_node``

``cd /opt/ros/indigo/share`` (first copy demo_web/3d/cors_server.py here)

``python cors_server.py``
### ssh on robot
fetch18: ``rosrun cloud_server pointcloud_downsample``

fetch7 : ``rosrun rgbd_grabber pointcloud_downsample``

``rosrun topic_tools throttle messages /downsampled_points 1``
### vulcan nav
run vulcan nav web as instructed in github/progress-demos 
### browser
open demo_web/3d/progress_demos.html