//gridlines
function create_grid(){
	var tetris_grid_position = Array(lineHeight*4+lineWidth*4);
	
	//vertical lines
	for(var i = 0; i <= lineWidth; i++){
		tetris_grid_position[i*4] = unitWidth*i + -1.0;
		tetris_grid_position[i*4+1] = 1.0;
		tetris_grid_position[i*4+2] = unitWidth*i + -1.0;
		tetris_grid_position[i*4+3] = -1.0;
	}
	
	arrayOffset = 11*4;
	//horizontal lines
	for(var i = 0; i <= lineHeight; i++){
		tetris_grid_position[i*4+arrayOffset] = -1.0;
		tetris_grid_position[i*4+arrayOffset+1] = unitHeight*i + -1.0;
		tetris_grid_position[i*4+arrayOffset+2] = 1.0;
		tetris_grid_position[i*4+arrayOffset+3] = unitHeight*i + -1.0;
	}
	
	var tetris_grid_color = Array((lineHeight+1)*8+(lineWidth+1)*8);
	
	for(var i = 0; i < tetris_grid_color.length; i++){
		tetris_grid_color[i] = 0.45;
		// if(i % 4 == 0){tetris_grid_color[i] = 1.0}
	}

	return {
		tetris_grid_position,
		tetris_grid_color, 
	};
}
