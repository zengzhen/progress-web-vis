#include <iostream>
#include <pcl/io/pcd_io.h>
#include <pcl/point_types.h>
#include <pcl/filters/voxel_grid.h>
#include <ros/ros.h>
#include <sensor_msgs/PointCloud2.h>
#include <pcl_conversions/pcl_conversions.h>

ros::NodeHandle* node_handle;
ros::Publisher rgbd_publisher;

void rgbd_callback(const sensor_msgs::PointCloud2ConstPtr& msg)
{
	pcl::PCLPointCloud2::Ptr cloud(new pcl::PCLPointCloud2());
	pcl::PCLPointCloud2::Ptr cloud_filtered(new pcl::PCLPointCloud2());

	pcl_conversions::toPCL(*msg, *cloud);
    //std::cerr << "PointCloud before filtering: " << cloud->width * cloud->height
    //   << " data points (" << pcl::getFieldsList (*cloud) << ").";
  
    // Create the filtering object
    pcl::VoxelGrid<pcl::PCLPointCloud2> sor;
    sor.setInputCloud (cloud);
    sor.setLeafSize (0.02f, 0.02f, 0.02f);
    sor.filter(*cloud_filtered);
  
  //std::cerr << "PointCloud after filtering: " << cloud_filtered->width * cloud_filtered->height
  //     << " data points (" << pcl::getFieldsList (*cloud_filtered) << ").";

	sensor_msgs::PointCloud2 output;
	pcl_conversions::fromPCL(*cloud_filtered, output);

	rgbd_publisher.publish(output);
}

int
main (int argc, char** argv)
{
	ros::init(argc, argv, "pointcloud_downsample");
    node_handle = new ros::NodeHandle();
	ros::Rate rate(30);

    ros::Subscriber rgbd_subscriber = node_handle->subscribe("/head_camera/depth_registered/points", 100, rgbd_callback);
    rgbd_publisher = node_handle->advertise<sensor_msgs::PointCloud2>("/downsampled_points", 100);
	
	ros::spin();


  return (0);
}
