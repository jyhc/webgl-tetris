//create keyboard input listener
function keyEventListener() {
	document.addEventListener('keydown', (event) => {
        keyAction(event);
	});
}

//action to be performed based on keypress
function keyAction(event){
    //left arrow key
    if(event.code == 'ArrowLeft'){
        const tile = renderQueue[renderQueue.length-1];
        for(var i = 0; i < tile.positions.length; i+=2){
            tile.positions[i]-=unitWidth;
        }
    } else if (event.code == 'ArrowRight'){
        const tile = renderQueue[renderQueue.length-1];
        for(var i = 0; i < tile.positions.length; i+=2){
            tile.positions[i]+=unitWidth;
        }
    } else if (event.code == 'ArrowUp'){
        const tile = renderQueue[renderQueue.length-1];
        for(var i = 1; i < tile.positions.length; i+=2){
            tile.positions[i]+=unitHeight;
        }
    } else if (event.code == 'ArrowDown'){
        const tile = renderQueue[renderQueue.length-1];
        for(var i = 1; i < tile.positions.length; i+=2){
            tile.positions[i]-=unitHeight;
        }
    }
}