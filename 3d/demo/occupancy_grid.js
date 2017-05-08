/**
 *  adapted from http://robotwebtools.org/jsdoc/ros2djs/current/OccupancyGrid.js.html
 */

function OccupancyGrid(message) {
    // set the size
    this.width = message.widthInCells;
    this.height = message.heightInCells;
    scale = message.widthInCells/message.widthInMeters;
    
    if(message.costGrid)
    {
        imageData = lpm_ctx.getImageData(0,0,this.width, this.height);
        for ( var j = 0; j < message.costGrid.length; j+=3) {
            // determine the index into the map data
            var col = message.costGrid[j];
            var row = message.costGrid[j+1];
            var data = message.costGrid[j+2];
            var val=255-data;

            // determine the index into the image data array
            row = (this.height - row - 1);
            var i = (col + (row * this.width)) * 4;
            // r
            imageData.data[i] = val;
            // g
            imageData.data[++i] = val;
            // b
            imageData.data[++i] = val;
            // a
            imageData.data[++i] = 255;
        }
    }
    
    lpm_ctx.putImageData(imageData, 0, 0);
    occupancy_grid_texture.needsUpdate = true;
    
};