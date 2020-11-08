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
        leftShift();
    } else if (event.code == 'ArrowRight'){
        rightShift();
    } else if (event.code == 'ArrowUp'){
        rotatePiece();
    } else if (event.code == 'ArrowDown'){
        dropPiece();
    } else if (event.code == 'KeyP'){
        popLast();
    }
}

function leftShift(){
    const tile = renderQueue[renderQueue.length-1];
    for(var i = 0; i < tile.positions.length; i+=2){
        if(tile.positions[i] <= -1.0){return;}
    }
    for(var i = 0; i < tile.positions.length; i+=2){
        tile.positions[i]-=unitWidth;
        tile.positions[i] = round(tile.positions[i], 3);
    }
    tile.cx-=unitWidth;
    tile.cx = round(tile.cx, 3);

}

function rightShift(){
    const tile = renderQueue[renderQueue.length-1];
    for(var i = 0; i < tile.positions.length; i+=2){
        if(tile.positions[i] >= 1.0){return;}
    }
    for(var i = 0; i < tile.positions.length; i+=2){
        tile.positions[i]+=unitWidth;
        tile.positions[i] = round(tile.positions[i], 3);
    }
    tile.cx+=unitWidth;
    tile.cx = round(tile.cx, 3);
}

function upShift(){
    const tile = renderQueue[renderQueue.length-1];
    for(var i = 1; i < tile.positions.length; i+=2){
        if(tile.positions[i] >= 1.0){return;}
    }
    for(var i = 1; i < tile.positions.length; i+=2){
        tile.positions[i]+=unitHeight;
        tile.positions[i] = round(tile.positions[i], 3);
    }
    tile.cy+=unitHeight;
    tile.cy = round(tile.cy, 3);
}

function dropPiece(){
    const tile = renderQueue[renderQueue.length-1];
    for(var i = 1; i < tile.positions.length; i+=2){
        if(tile.positions[i] <= -1.0){return;}
    }
    for(var i = 1; i < tile.positions.length; i+=2){
        tile.positions[i]-=unitHeight;
        tile.positions[i] = round(tile.positions[i], 3);
    }
    tile.cy-=unitHeight;
    tile.cy = round(tile.cy, 3);
}

//rotate piece counterclockwise by 90 degrees
function rotatePiece(){
    const tile = renderQueue[renderQueue.length-1];
    for(var i = 0; i < tile.positions.length; i+=2){
        const newlocation = rotatePoint(tile.cx, tile.cy, 
            tile.positions[i], tile.positions[i+1]);
        tile.positions[i] = newlocation.x;
        tile.positions[i+1] = newlocation.y;
    }
}

function rotatePoint(cx, cy, px, py){
    // var s = Math.sin(angle);
    // var c = Math.cos(angle);

    px = round(px-cx, 3);
    py = round(py-cy, 3);
    
    //normalize y to x
    
    var xnew = -py*2 + cx;
    var ynew = px/2 + cy;

    return {
        x: round(xnew, 3),
        y: round(ynew, 3),
    }
}

function touchingBottom(){
    const tile = renderQueue[renderQueue.length-1];
    for(var i = 1; i < tile.positions.length; i+=2){
        if(tile.positions[i] <= -1.0){
            addRandomPiecetoGame(programInfo, gl);
        }
    }   
}

//test function
function popLast(){
    renderQueue.pop();
}

function addRandomPiecetoGame(programInfo, gl){
    const random = Math.floor(Math.random() * gamePieces.length);
    if(gamePieces[random] == 'o'){
        renderQueue.push(new OPiece(programInfo, gl));
    } else if(gamePieces[random] == 'i'){
        renderQueue.push(new IPiece(programInfo, gl));
    } else if(gamePieces[random] == 's'){
        renderQueue.push(new SPiece(programInfo, gl));
    } else if(gamePieces[random] == 'z'){
        renderQueue.push(new ZPiece(programInfo, gl));
    } else if(gamePieces[random] == 'l'){
        renderQueue.push(new LPiece(programInfo, gl));
    } else if(gamePieces[random] == 'j'){
        renderQueue.push(new JPiece(programInfo, gl));
    } else if(gamePieces[random] == 't'){
        renderQueue.push(new TPiece(programInfo, gl));
    }
}