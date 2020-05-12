# demo_web
<a href="http://www.youtube.com/watch?feature=player_embedded&v=ltS5nVfyOWA
" target="_blank"><img src="http://img.youtube.com/vi/ltS5nVfyOWA/2.jpg" 
alt="web front-end for robot demos" width="480" height="360" border="10" /></a>

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
