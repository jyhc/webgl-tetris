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
    } else if (event.code == "KeyR"){
        restart();
    } else if (event.code == "KeyQ"){
        quit();
    }
}

function leftShift(){
    const tile = renderQueue[renderQueue.length-1];
    const rowcol = posToRC(tile.positions);
    if(pieceLeft(rowcol)){return;}
    for(var i = 0; i < tile.positions.length; i+=2){
        tile.positions[i]-=unitWidth;
        tile.positions[i] = round(tile.positions[i], 3);
    }
    tile.cx-=unitWidth;
    tile.cx = round(tile.cx, 3);

}

function rightShift(){
    const tile = renderQueue[renderQueue.length-1];
    const rowcol = posToRC(tile.positions);
    if(pieceRight(rowcol)){return;}
    for(var i = 0; i < tile.positions.length; i+=2){
        tile.positions[i]+=unitWidth;
        tile.positions[i] = round(tile.positions[i], 3);
    }
    tile.cx+=unitWidth;
    tile.cx = round(tile.cx, 3);
}

// function upShift(){
//     const tile = renderQueue[renderQueue.length-1];
//     var rowcol = posToRC(tile.positions);
//     for(var i = 1; i < tile.positions.length; i+=2){
//         if(tile.positions[i] >= 1.0){return;}
//     }
//     for(var i = 1; i < tile.positions.length; i+=2){
//         tile.positions[i]+=unitHeight;
//         tile.positions[i] = round(tile.positions[i], 3);
//     }
//     tile.cy+=unitHeight;
//     tile.cy = round(tile.cy, 3);
// }

function dropPiece(){
    const tile = renderQueue[renderQueue.length-1];
    const rowcol = posToRC(tile.positions);
    if(pieceBelow(rowcol)){return;}
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
    const newPos = tile.positions.splice();
    for(var i = 0; i < tile.positions.length; i+=2){
        const newlocation = rotatePoint(tile.cx, tile.cy, tile.positions[i], tile.positions[i+1]);
        newPos[i] = newlocation.x;
        newPos[i+1] = newlocation.y;
    }    
    const rowcol = posToRC(newPos);
    //if rotated to position already has block, abandon rotation
    if(occupied(rowcol)){return;}
    
    tile.positions = newPos;
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

function addRandomPiecetoGame(programInfo, gl){
    const random = Math.floor(Math.random() * gamePieces.length);
    const randOrientation = Math.floor(Math.random() * 3);
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

    const tile = renderQueue[renderQueue.length-1];
    const rowcol = posToRC(tile.positions);
    if(occupied(rowcol)){
        renderQueue.pop();
        return;
    }

    for(var i = 0; i < randOrientation; i++){
        rotatePiece();
    }
}

//calculate row col occupied by piece
function posToRC(pos){

    //row col pairs
    var rowcol = new Array();

    //extract in sets of 8 that specifies a rectangle
    for(var i = 0; i < pos.length; i+=8){
        var minX = pos[i];
        var maxX = pos[i];
        var minY = pos[i+1];
        var maxY = pos[i+1];
        
        for(var j = 0; j < 8; j+=2){
            minX = Math.min(minX, pos[i+j]);
            maxX = Math.max(maxX, pos[i+j]);
            minY = Math.min(minY, pos[i+j+1]);
            maxY = Math.max(maxY, pos[i+j+1]);
        }

        minX += 1.0;
        maxX += 1.0;
        minY += 1.0;
        maxY += 1.0;
        
        var rowStart = Math.round(round(minX/unitWidth, 0)) + 1;
        var rowEnd = Math.round(round(maxX/unitWidth, 0)) + 1;
        var colStart = Math.round(round(minY/unitHeight, 0)) + 1;
        var colEnd = Math.round(round(maxY/unitHeight, 0)) + 1;

        for (var r = rowStart; r < rowEnd; r++){
            for(var c = colStart; c < colEnd; c++){
                rowcol.push([c, r]);
            }
        }
    }
    return rowcol;
}

function occupied(rowcol){
    for(var i = 0; i < rowcol.length; i++){
        if(gridState[rowcol[i][0]][rowcol[i][1]]){return true;}
    }
    return false;
}

//check if there is anything below current piece
function pieceBelow(rowcol){
    for(var i = 0; i < rowcol.length; i++){
        if(gridState[rowcol[i][0]-1][rowcol[i][1]]){return true;}
    }
    return false;
}

// function pieceAbove(rowcol){
//     for(var i = 0; i < rowcol.length; i++){
//         if(gridState[rowcol[i][0]+1][rowcol[i][1]]){return true;}
//     }
//     return false;
// }

function pieceRight(rowcol){
    for(var i = 0; i < rowcol.length; i++){
        if(gridState[rowcol[i][0]][rowcol[i][1] + 1]){return true;}
    }
    return false;
}


function pieceLeft(rowcol){
    for(var i = 0; i < rowcol.length; i++){
        if(gridState[rowcol[i][0]][rowcol[i][1] - 1]){return true;}
    }
    return false;
}

function updateGridState(rowcol){
    for(var i = 0; i < rowcol.length; i++){
        gridState[rowcol[i][0]][rowcol[i][1]] = true;
    }
}

function clearRenderQueue(){
    quit();
    addRandomPiecetoGame(programInfo, gl);
}

function touchingBottom(){
    const tile = renderQueue[renderQueue.length-1];
    var rowcol = posToRC(tile.positions);
    if(pieceBelow(rowcol)){
        updateGridState(rowcol);
        addRandomPiecetoGame(programInfo, gl);
    }
}

function quit(){
    while(renderQueue.length != 1){
        renderQueue.pop();
    }
}

function restart(){
    resetGridState();
    clearRenderQueue();
}