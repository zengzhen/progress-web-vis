/**
 *  adapted from http://robotwebtools.org/jsdoc/ros2djs/current/OccupancyGrid.js.html
 */

function OccupancyGrid(message) {
    // set the size
    this.width = message.widthInCells;
    this.height = message.heightInCells;
    scale = message.widthInCells/message.widthInMeters;
    
    if(lpm_ctx_initial)
    {
//         lpm_canvas.width = this.width;
//         lpm_canvas.height = this.height;
//         lpm_ctx.fillStyle="gray";
//         lpm_ctx.fillRect(0,0,lpm_canvas.width,lpm_canvas.height);
        
        var geometry = new THREE.PlaneGeometry( 5, 20, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometry, material );
        scene.add( plane );
        
        imageData = lpm_ctx.getImageData(0,0,this.width, this.height);
        lpm_ctx_initial=false;
    }

//  var imageData = lpm_ctx.createImageData(this.width, this.height);
//  var imageData = lpm_ctx.getImageData(0,0,this.width, this.height);
    
    if(message.costGrid)
    {
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
};